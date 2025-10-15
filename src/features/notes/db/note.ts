// drizzle and db access
import { db } from "@/drizzle/db";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";

// all table definitions (their schemas)
import { NoteTable } from "@/drizzle/schema";

// types
import type { DbOrTx } from "@/drizzle/db";

export const getNotesWithPagination = async (
  userId: string,
  currentPage: number = 1,
  itemsPerPage: number = 3,
  sortByField: "created_at" | "updated_at" | "title" = "updated_at",
  sortByDirection: "asc" | "desc" = "desc",
) => {
  const [notes, [{ totalItems }]] = await Promise.all([
    db
      .select({
        id: NoteTable.id,
        title: NoteTable.title,
        contentPreview: sql<string>`substring(${NoteTable.content} from 1 for 512)`,
        updatedAt: NoteTable.updatedAt,
      })
      .from(NoteTable)
      .where(eq(NoteTable.userId, userId))
      .orderBy(
        sortByDirection === "asc"
          ? asc(sortByField === "created_at" ? NoteTable.createdAt : sortByField === "updated_at" ? NoteTable.updatedAt : NoteTable.title)
          : desc(sortByField === "created_at" ? NoteTable.createdAt : sortByField === "updated_at" ? NoteTable.updatedAt : NoteTable.title),
      )
      .limit(itemsPerPage)
      .offset((currentPage - 1) * itemsPerPage),

    db.select({ totalItems: count() }).from(NoteTable).where(eq(NoteTable.userId, userId)),
  ]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return { notes, totalPages, prevPage: Math.max(1, currentPage - 1), nextPage: Math.min(totalPages, currentPage + 1) };
};

// Retrieve all notes for a user, including only the essential fields, and shorten the content for preview purposes
export const getNotes = (userId: string, limit?: number) => {
  const query = db
    .select({
      id: NoteTable.id,
      title: NoteTable.title,
      contentPreview: sql<string>`substring(${NoteTable.content} from 1 for 512)`,
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

// Drop all notes for a user (supports normal db or transaction)
export const dropAllNotes = (userId: string, tx: DbOrTx = db) => tx.delete(NoteTable).where(eq(NoteTable.userId, userId));

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
