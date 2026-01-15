// drizzle and db access
import { DB } from "@/drizzle/dbEffect2";
import { and, asc, count, desc, eq, ilike, inArray, or, SQL, sql } from "drizzle-orm";

// services, features, and other libraries
import { Effect } from "effect";

// all table definitions (their schemas)
import { NoteTable, NoteTagTable, NoteToNoteTagTable } from "@/drizzle/schema";

// types
import type { NotePreferencesStored } from "@/features/notes/stores/notePreferences";

export class Note extends Effect.Service<Note>()("Note", {
  dependencies: [DB.Default],

  effect: Effect.gen(function* () {
    const { db, execute } = yield* DB;

    return {
      // Retrieve all notes for a user, including only the essential fields, and shorten the content for preview purposes
      getNotesWithPagination: (
        userId: string,
        searchTerm: string = "",
        currentPage: number = 1,
        itemsPerPage: number = 10,
        sortByField: "title" | "created_at" | "updated_at" = "updated_at",
        sortByDirection: "asc" | "desc" = "desc",
        filterByTagIds: string[] = [],
      ) =>
        Effect.gen(function* () {
          // Revise the 'where' clause dynamically for enhanced readability; the base condition is to always filter by userId
          const conditions: (SQL | undefined)[] = [eq(NoteTable.userId, userId)];

          // Search condition: match title or content if the search term exists
          if (searchTerm) conditions.push(or(ilike(NoteTable.title, `%${searchTerm}%`), ilike(NoteTable.content, `%${searchTerm}%`)));

          // Tag filter condition: filter by note tag IDs if they are provided
          if (filterByTagIds.length > 0) {
            // Subquery: select all note IDs that have any of the provided note tag IDs
            const notesWithTagsSubquery = db
              .select({ noteId: NoteToNoteTagTable.noteId })
              .from(NoteToNoteTagTable)
              .where(inArray(NoteToNoteTagTable.noteTagId, filterByTagIds));

            // Main query logic: only select notes whose ID is found in the subquery
            conditions.push(inArray(NoteTable.id, notesWithTagsSubquery));
          }

          // Combine all conditions
          const whereClause = and(...conditions);

          // Define sorting column and direction
          const sortColumn = sortByField === "title" ? NoteTable.title : sortByField === "created_at" ? NoteTable.createdAt : NoteTable.updatedAt;
          const sortOrder = sortByDirection === "asc" ? asc : desc;

          // Run queries in parallel for efficiency
          const notesQuery = execute((dbOrTx) =>
            dbOrTx
              .select({
                id: NoteTable.id,
                title: NoteTable.title,
                contentPreview: sql<string>`substring(${NoteTable.content} from 1 for 512)`,
                preferences: NoteTable.preferences,
                createdAt: NoteTable.createdAt,
                updatedAt: NoteTable.updatedAt,

                // Correlated subquery to retrieve tags for each note
                tags: getNoteTagsSql(),
              })
              .from(NoteTable)
              .where(whereClause)
              .orderBy(sortOrder(sortColumn))
              .limit(itemsPerPage)
              .offset((currentPage - 1) * itemsPerPage),
          );
          const countQuery = execute((dbOrTx) => dbOrTx.select({ totalItems: count() }).from(NoteTable).where(whereClause));
          const [notes, [{ totalItems }]] = yield* Effect.all([notesQuery, countQuery], { concurrency: 2 });

          return { notes, totalItems, totalPages: Math.ceil(totalItems / itemsPerPage) };
        }),

      // Retrieve the most recently updated notes for a user, with an optional limit
      getMostRecentNotes: (userId: string, limit?: number) =>
        execute((dbOrTx) => {
          const query = dbOrTx
            .select({
              id: NoteTable.id,
              title: NoteTable.title,
              contentPreview: sql<string>`substring(${NoteTable.content} from 1 for 512)`,
              preferences: NoteTable.preferences,
              createdAt: NoteTable.createdAt,
              updatedAt: NoteTable.updatedAt,

              // Correlated subquery to retrieve tags for each note
              tags: getNoteTagsSql(),
            })
            .from(NoteTable)
            .where(eq(NoteTable.userId, userId))
            .orderBy(desc(NoteTable.updatedAt))
            .$dynamic();

          return limit ? query.limit(limit) : query;
        }),

      // Get a single note for a user
      getNote: (id: string, userId: string) =>
        execute((dbOrTx) =>
          dbOrTx.query.NoteTable.findFirst({
            where: and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)),
            with: { noteToNoteTag: { columns: { noteTagId: true } } },
          }),
        ),

      // Get the title of a note for a user
      getNoteTitle: (id: string, userId: string) =>
        execute((dbOrTx) => dbOrTx.query.NoteTable.findFirst({ columns: { title: true }, where: and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)) })),

      // Get the preferences of a note for a user
      getNotePreferences: (id: string, userId: string) =>
        execute((dbOrTx) =>
          dbOrTx.query.NoteTable.findFirst({ columns: { preferences: true }, where: and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)) }),
        ),

      // Update the preferences of a note for a user
      updateNotePreferences: (id: string, userId: string, preferences: NotePreferencesStored) =>
        execute((dbOrTx) =>
          dbOrTx
            .update(NoteTable)
            // Silently update note preferences and do not consider it a meaningful note update
            .set({ preferences, updatedAt: NoteTable.updatedAt })
            .where(and(eq(NoteTable.id, id), eq(NoteTable.userId, userId))),
        ),

      // Delete the preferences of a note for a user
      deleteNotePreferences: (id: string, userId: string) =>
        execute((dbOrTx) =>
          dbOrTx
            .update(NoteTable)
            .set({ preferences: null })
            .where(and(eq(NoteTable.id, id), eq(NoteTable.userId, userId))),
        ),

      // Insert a new note for a user
      insertNote: (userId: string, data: Omit<typeof NoteTable.$inferInsert, "userId">) =>
        execute((dbOrTx) =>
          dbOrTx
            .insert(NoteTable)
            .values({ userId, ...data })
            .returning({ id: NoteTable.id }),
        ),

      // Update a note for a user
      updateNote: (id: string, userId: string, data: Partial<Omit<typeof NoteTable.$inferInsert, "id" | "userId">>) =>
        execute((dbOrTx) =>
          dbOrTx
            .update(NoteTable)
            .set(data)
            .where(and(eq(NoteTable.id, id), eq(NoteTable.userId, userId))),
        ),

      // Delete a note for a user
      deleteNote: (id: string, userId: string) => execute((dbOrTx) => dbOrTx.delete(NoteTable).where(and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)))),
    };
  }),
}) {}

// Correlated subquery to retrieve tags for each note
const getNoteTagsSql = () => sql<{ id: string; name: string }[]>`(
    SELECT COALESCE(jsonb_agg(jsonb_build_object('id', ${NoteTagTable.id}, 'name', ${NoteTagTable.name})), '[]'::jsonb)
    FROM ${NoteToNoteTagTable}
    JOIN ${NoteTagTable} ON ${NoteToNoteTagTable.noteTagId} = ${NoteTagTable.id}
    WHERE ${NoteToNoteTagTable.noteId} = ${sql.raw("note.id")}
  )`;
