// drizzle and db access
import { db } from "@/drizzle/db";
import { and, asc, eq, ilike, inArray } from "drizzle-orm";

// all table definitions (their schemas)
import { NoteTagTable, NoteToNoteTagTable } from "@/drizzle/schema";

// types
import type { DbOrTx } from "@/drizzle/db";

// Retrieve all note tags for a specific user ordered alphabetically (useful for the tag management list or autocomplete)
export const getAvailNoteTags = (userId: string) =>
  db.query.NoteTagTable.findMany({ columns: { id: true, name: true }, where: eq(NoteTagTable.userId, userId), orderBy: [asc(NoteTagTable.name)] });

// Map URL-provided note tag indexes to their corresponding note tag IDs using the ordered list of all available note tags for this user
export const noteTagIndexesToIds = (filterByTagIndxs: number[], availNoteTags: Awaited<ReturnType<typeof getAvailNoteTags>>) =>
  // Invalid or out-of-bounds indexes resolve to `undefined` and are filtered out to keep the query safe
  filterByTagIndxs.map((i) => availNoteTags[i]?.id).filter((id): id is string => Boolean(id));

// Synchronize all incoming note tags with the existing ones for this user
export const syncMyNoteTags = async (userId: string, incomingNoteTags: { id: string; name: string }[]) => {
  // Run all db operations in a transaction
  await db.transaction(async (tx) => {
    // Fetch all existing tags for this user
    const allExistingTags = await tx.query.NoteTagTable.findMany({ columns: { id: true, name: true }, where: eq(NoteTagTable.userId, userId) });

    // Prepare lookup for incoming IDs
    const incomingIdsSet = new Set(incomingNoteTags.map(({ id }) => id));

    // Split existing tags into survivors (still present) and deletions (not present)
    const survivingTags: typeof allExistingTags = [];
    const tagsToDeleteIds: string[] = [];

    for (const tag of allExistingTags)
      if (incomingIdsSet.has(tag.id)) survivingTags.push(tag);
      else tagsToDeleteIds.push(tag.id);

    // Delete all removed tags first (avoids false name collisions)
    if (tagsToDeleteIds.length > 0) await tx.delete(NoteTagTable).where(and(eq(NoteTagTable.userId, userId), inArray(NoteTagTable.id, tagsToDeleteIds)));

    // Maps built only from surviving tags to prevent name conflicts with tags that were just deleted
    const existingTagById = new Map(survivingTags.map((tag) => [tag.id, tag]));
    const existingNameToId = new Map(survivingTags.map(({ name, id }) => [name.trim().toLowerCase(), id]));

    // Hold tags to insert in a batch
    const tagsToInsert: typeof incomingNoteTags = [];

    // Single pass to handle updates and collect inserts
    for (const { id: incomingId, name: rawName } of incomingNoteTags) {
      const incomingName = rawName.trim();
      const incomingNameLower = incomingName.toLowerCase();

      const existingTag = existingTagById.get(incomingId);
      const collisionId = existingNameToId.get(incomingNameLower);

      // Prevent name collisions (unique constraint)
      if (collisionId && collisionId !== incomingId) continue;

      if (existingTag) {
        // Update only if name changed
        if (existingTag.name.trim().toLowerCase() !== incomingNameLower) {
          await tx
            .update(NoteTagTable)
            .set({ name: incomingName })
            .where(and(eq(NoteTagTable.id, incomingId), eq(NoteTagTable.userId, userId)));

          // Refresh in-memory name map
          existingNameToId.delete(existingTag.name.trim().toLowerCase());
          existingNameToId.set(incomingNameLower, incomingId);
        }
      } else {
        // New tag
        tagsToInsert.push({ id: incomingId, name: incomingName });

        // Add to name map to avoid duplicate-name inserts in the same batch
        existingNameToId.set(incomingNameLower, incomingId);
      }
    }

    // Insert all new tags at once
    if (tagsToInsert.length > 0) await tx.insert(NoteTagTable).values(tagsToInsert.map(({ id, name }) => ({ id, userId, name })));
  });
};

// Sync tags for a note (useful when the UI sends a full list of tags)
export const syncNoteTags = async (noteId: string, noteTagIds: string[]) => {
  // Run all db operations in a transaction
  await db.transaction(async (tx) => {
    // Delete all existing links for this note (this is efficient enough for notes that rarely have more than 10 note tags)
    await tx.delete(NoteToNoteTagTable).where(eq(NoteToNoteTagTable.noteId, noteId));

    // If there are note tags to add, insert them all
    if (noteTagIds.length > 0) await tx.insert(NoteToNoteTagTable).values(noteTagIds.map((noteTagId) => ({ noteId, noteTagId })));
  });
};

// Search note tags for a user (useful for the "type to add..." dropdown)
export const searchNoteTags = (userId: string, query: string, limit: number = 10) =>
  db
    .select()
    .from(NoteTagTable)
    .where(and(eq(NoteTagTable.userId, userId), ilike(NoteTagTable.name, `%${query}%`)))
    .orderBy(asc(NoteTagTable.name))
    .limit(limit);

// Get all note tags associated with a specific note
export const getNoteTagsForNote = (userId: string, noteId: string) =>
  db
    .select({
      id: NoteTagTable.id,
      name: NoteTagTable.name,
    })
    .from(NoteTagTable)
    .innerJoin(NoteToNoteTagTable, eq(NoteTagTable.id, NoteToNoteTagTable.noteTagId))
    .where(and(eq(NoteTagTable.userId, userId), eq(NoteToNoteTagTable.noteId, noteId)))
    .orderBy(asc(NoteTagTable.name));

// Get a note tag by name or create it if it does not exist; this is crucial for a smooth UX where users just type a tag name and hit enter
export const getOrCreateNoteTag = async (userId: string, name: string, tx: DbOrTx = db) => {
  // Try to find it first (optimization)
  const existingNoteTagId = await tx.query.NoteTagTable.findFirst({
    columns: { id: true },
    where: and(eq(NoteTagTable.userId, userId), eq(NoteTagTable.name, name)),
  });
  if (existingNoteTagId) return existingNoteTagId;

  // If not found, insert it
  const [newNoteTagId] = await tx
    .insert(NoteTagTable)
    .values({ userId, name })

    // Handle race conditions (if two requests try to create the same note tag at the exact same time)
    .onConflictDoUpdate({
      // The unique index we created
      target: [NoteTagTable.userId, NoteTagTable.name],

      // "Touch" the note tag if it conflicts
      set: { updatedAt: new Date() },
    })
    .returning({ id: NoteTagTable.id });

  return newNoteTagId;
};

// Rename a note tag (for example, when a user fixes a typo)
export const updateNoteTagName = (noteTagId: string, userId: string, newName: string, tx: DbOrTx = db) =>
  tx
    .update(NoteTagTable)
    .set({ name: newName })
    .where(and(eq(NoteTagTable.id, noteTagId), eq(NoteTagTable.userId, userId)));

// Delete a note tag entirely from the system
export const deleteNoteTag = (noteTagId: string, userId: string, tx: DbOrTx = db) =>
  tx.delete(NoteTagTable).where(and(eq(NoteTagTable.id, noteTagId), eq(NoteTagTable.userId, userId)));

// --------------------------------
// LINKING (The Many-to-Many Magic)
// --------------------------------

// Add a note tag to a note
export const addNoteTagToNote = async (noteId: string, noteTagId: string, tx: DbOrTx = db) =>
  tx
    .insert(NoteToNoteTagTable)
    .values({ noteId, noteTagId })

    // If already tagged, do nothing; no error needed
    .onConflictDoNothing();

// Remove a note tag from a note
export const removeTagFromNote = async (noteId: string, noteTagId: string, tx: DbOrTx = db) =>
  tx.delete(NoteToNoteTagTable).where(and(eq(NoteToNoteTagTable.noteId, noteId), eq(NoteToNoteTagTable.noteTagId, noteTagId)));
