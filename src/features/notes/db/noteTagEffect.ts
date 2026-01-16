// drizzle and db access
import { DB } from "@/drizzle/dbEffect";
import { and, asc, eq, inArray } from "drizzle-orm";

// services, features, and other libraries
import { Effect } from "effect";

// all table definitions (their schemas)
import { NoteTagTable, NoteToNoteTagTable } from "@/drizzle/schema";

export class NoteTag extends Effect.Service<NoteTag>()("NoteTag", {
  dependencies: [DB.Default],

  effect: Effect.gen(function* () {
    const { execute, transaction } = yield* DB;

    // Retrieve all note tags for a specific user ordered alphabetically (useful for the tag management list or autocomplete)
    const getAvailNoteTags = (userId: string) =>
      execute((dbOrTx) =>
        dbOrTx.query.NoteTagTable.findMany({ columns: { id: true, name: true }, where: eq(NoteTagTable.userId, userId), orderBy: [asc(NoteTagTable.name)] }),
      );

    // Map URL-provided note tag indexes to their corresponding note tag IDs using the ordered list of all available note tags for this user
    const noteTagIndexesToIds = (filterByTagIndxs: readonly number[], availNoteTags: Effect.Effect.Success<ReturnType<typeof getAvailNoteTags>>) =>
      // Invalid or out-of-bounds indexes resolve to `undefined` and are filtered out to keep the query safe
      Effect.succeed(filterByTagIndxs.map((i) => availNoteTags[i]?.id).filter((id): id is string => Boolean(id)));

    // Synchronize all incoming note tags with the existing ones for this user
    const syncMyNoteTags = (userId: string, incomingNoteTags: readonly { id: string; name: string }[]) =>
      // Run all db operations in a transaction
      transaction(
        Effect.gen(function* () {
          // Fetch all existing tags for this user
          const allExistingTags = yield* execute((dbOrTx) =>
            dbOrTx.query.NoteTagTable.findMany({ columns: { id: true, name: true }, where: eq(NoteTagTable.userId, userId) }),
          );

          // Prepare lookup for incoming IDs
          const incomingIdsSet = new Set(incomingNoteTags.map(({ id }) => id));

          // Split existing tags into survivors (still present) and deletions (not present)
          const survivingTags: typeof allExistingTags = [];
          const tagsToDeleteIds: string[] = [];

          for (const tag of allExistingTags)
            if (incomingIdsSet.has(tag.id)) survivingTags.push(tag);
            else tagsToDeleteIds.push(tag.id);

          // Delete all removed tags first (avoids false name collisions)
          if (tagsToDeleteIds.length > 0)
            yield* execute((dbOrTx) => dbOrTx.delete(NoteTagTable).where(and(eq(NoteTagTable.userId, userId), inArray(NoteTagTable.id, tagsToDeleteIds))));

          // Maps built only from surviving tags to prevent name conflicts with tags that were just deleted
          const existingTagById = new Map(survivingTags.map((tag) => [tag.id, tag]));
          const existingNameToId = new Map(survivingTags.map(({ name, id }) => [name.trim().toLowerCase(), id]));

          // Hold tags to insert in a batch
          const tagsToInsert: { id: string; name: string }[] = [];

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
                yield* execute((dbOrTx) =>
                  dbOrTx
                    .update(NoteTagTable)
                    .set({ name: incomingName })
                    .where(and(eq(NoteTagTable.id, incomingId), eq(NoteTagTable.userId, userId))),
                );

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
          if (tagsToInsert.length > 0)
            yield* execute((dbOrTx) => dbOrTx.insert(NoteTagTable).values(tagsToInsert.map(({ id, name }) => ({ id, userId, name }))));
        }),
      );

    // Sync tags for a note (useful when the UI sends a full list of tags)
    const syncNoteTags = (noteId: string, noteTagIds: readonly string[]) =>
      // Run all db operations in a transaction
      transaction(
        Effect.gen(function* () {
          // Delete all existing links for this note (this is efficient enough for notes that rarely have more than 10 note tags)
          yield* execute((dbOrTx) => dbOrTx.delete(NoteToNoteTagTable).where(eq(NoteToNoteTagTable.noteId, noteId)));

          // If there are note tags to add, insert them all
          if (noteTagIds.length > 0)
            yield* execute((dbOrTx) => dbOrTx.insert(NoteToNoteTagTable).values(noteTagIds.map((noteTagId) => ({ noteId, noteTagId }))));
        }),
      );

    return {
      getAvailNoteTags,
      noteTagIndexesToIds,
      syncMyNoteTags,
      syncNoteTags,
    } as const;
  }),
}) {}
