// drizzle and db access
import { db } from "@/drizzle/db";
import { and, asc, eq, ilike } from "drizzle-orm";

// all table definitions (their schemas)
import { NoteTagTable, NoteToNoteTagTable } from "@/drizzle/schema";

// types
import type { DbOrTx } from "@/drizzle/db";

// Retrieve all note tags for a specific user ordered alphabetically (useful for the tag management list or autocomplete)
export const getAllNoteTags = (userId: string) => db.query.NoteTagTable.findMany({ where: eq(NoteTagTable.userId, userId), orderBy: [asc(NoteTagTable.name)] });

// Synchronize all incoming note tags with the existing ones for this user
export const syncMyNoteTags = async (userId: string, incomingNoteTags: { id: string; name: string }[]) => {
  // Run all db operations in a transaction
  await db.transaction(async (tx) => {
    // By managing the note tag IDs, we can ensure that incoming note tags, which previously existed and were renamed, will not be accidentally deleted
    const incomingNoteTagIds = incomingNoteTags.map(({ id }) => id);
    const existingNoteTagIds = (await db.query.NoteTagTable.findMany({ columns: { id: true }, where: eq(NoteTagTable.userId, userId) })).map(({ id }) => id);
    const newNoteTagsComingIn = incomingNoteTags.filter(({ id: incomingNoteTagId }) => !existingNoteTagIds.includes(incomingNoteTagId));
    const noteTagIdsToDelete = existingNoteTagIds.filter((existingNoteTagId) => !incomingNoteTagIds.includes(existingNoteTagId));

    // First delete all note tags that are not in the incoming list anymore
    for (const noteTagId of noteTagIdsToDelete) await tx.delete(NoteTagTable).where(and(eq(NoteTagTable.id, noteTagId), eq(NoteTagTable.userId, userId)));

    // Then, if there are new note tags coming in, insert them all
    if (newNoteTagsComingIn.length > 0) await tx.insert(NoteTagTable).values(newNoteTagsComingIn.map(({ id, name }) => ({ id, userId, name })));
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

// Sync tags for a note (useful when the UI sends a full list of tags)
export const syncNoteTags = async (noteId: string, noteTagIds: string[], tx: DbOrTx = db) => {
  // Delete all existing links for this note (this is efficient enough for notes that rarely have more than 10 note tags)
  await tx.delete(NoteToNoteTagTable).where(eq(NoteToNoteTagTable.noteId, noteId));

  // If there are note tags to add, insert them all
  if (noteTagIds.length > 0) await tx.insert(NoteToNoteTagTable).values(noteTagIds.map((noteTagId) => ({ noteId, noteTagId })));
};
