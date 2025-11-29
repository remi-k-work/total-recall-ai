// drizzle and db access
import { db } from "@/drizzle/db";
import { and, asc, count, desc, eq, ilike, or, SQL, sql } from "drizzle-orm";

// all table definitions (their schemas)
import { NoteTable } from "@/drizzle/schema";

// types
import type { DbOrTx } from "@/drizzle/db";
import type { NotePreferencesStored } from "@/features/notes/stores/notePreferences";

// Retrieve all notes for a user, including only the essential fields, and shorten the content for preview purposes
export const getNotesWithPagination = async (
  userId: string,
  searchTerm: string = "",
  currentPage: number = 1,
  itemsPerPage: number = 10,
  sortByField: "title" | "created_at" | "updated_at" = "updated_at",
  sortByDirection: "asc" | "desc" = "desc",
) => {
  // Build the 'where' clause dynamically for better readability
  const conditions: (SQL | undefined)[] = [eq(NoteTable.userId, userId)];
  if (searchTerm) conditions.push(or(ilike(NoteTable.title, `%${searchTerm}%`), ilike(NoteTable.content, `%${searchTerm}%`)));
  const whereClause = and(...conditions);

  // Define sorting column and direction
  const sortColumn = sortByField === "title" ? NoteTable.title : sortByField === "created_at" ? NoteTable.createdAt : NoteTable.updatedAt;
  const sortOrder = sortByDirection === "asc" ? asc : desc;

  // Run queries in parallel for efficiency
  const [notes, [{ totalItems }]] = await Promise.all([
    db
      .select({
        id: NoteTable.id,
        title: NoteTable.title,
        contentPreview: sql<string>`substring(${NoteTable.content} from 1 for 512)`,
        preferences: NoteTable.preferences,
        createdAt: NoteTable.createdAt,
        updatedAt: NoteTable.updatedAt,
      })
      .from(NoteTable)
      .where(whereClause)
      .orderBy(sortOrder(sortColumn))
      .limit(itemsPerPage)
      .offset((currentPage - 1) * itemsPerPage),

    db.select({ totalItems: count() }).from(NoteTable).where(whereClause),
  ]);

  return { notes, totalItems, totalPages: Math.ceil(totalItems / itemsPerPage) };
};

// Retrieve the most recently updated notes for a user, with an optional limit
export const getMostRecentNotes = (userId: string, limit?: number) => {
  const query = db
    .select({
      id: NoteTable.id,
      title: NoteTable.title,
      contentPreview: sql<string>`substring(${NoteTable.content} from 1 for 512)`,
      preferences: NoteTable.preferences,
      createdAt: NoteTable.createdAt,
      updatedAt: NoteTable.updatedAt,
    })
    .from(NoteTable)
    .where(eq(NoteTable.userId, userId))
    .orderBy(desc(NoteTable.updatedAt))
    .$dynamic();

  return limit ? query.limit(limit) : query;
};

// Get a single note for a user
export const getNote = (id: string, userId: string) => db.query.NoteTable.findFirst({ where: and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)) });

// Get the title of a note for a user
export const getNoteTitle = (id: string, userId: string) =>
  db.query.NoteTable.findFirst({ columns: { title: true }, where: and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)) });

// Get the preferences of a note for a user
export const getNotePreferences = (id: string, userId: string) =>
  db.query.NoteTable.findFirst({ columns: { preferences: true }, where: and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)) });

// Update the preferences of a note for a user (supports normal db or transaction)
export const updateNotePreferences = (id: string, userId: string, preferences: NotePreferencesStored, tx: DbOrTx = db) =>
  tx
    .update(NoteTable)
    // Silently update note preferences and do not consider it a meaningful note update
    .set({ preferences, updatedAt: NoteTable.updatedAt })
    .where(and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)));

// Delete the preferences of a note for a user (supports normal db or transaction)
export const deleteNotePreferences = (id: string, userId: string, tx: DbOrTx = db) =>
  tx
    .update(NoteTable)
    .set({ preferences: null })
    .where(and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)));

// Insert a new note for a user (supports normal db or transaction)
export const insertNote = (userId: string, data: Omit<typeof NoteTable.$inferInsert, "userId">, tx: DbOrTx = db) =>
  tx
    .insert(NoteTable)
    .values({ userId, ...data })
    .returning({ id: NoteTable.id });

// Update a note for a user (supports normal db or transaction)
export const updateNote = (id: string, userId: string, data: Partial<Omit<typeof NoteTable.$inferInsert, "id" | "userId">>, tx: DbOrTx = db) =>
  tx
    .update(NoteTable)
    .set(data)
    .where(and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)));

// Delete a note for a user (supports normal db or transaction)
export const deleteNote = (id: string, userId: string, tx: DbOrTx = db) => tx.delete(NoteTable).where(and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)));
