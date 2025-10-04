// drizzle and db access
import { db } from "@/drizzle/db";
import { and, eq, sql } from "drizzle-orm";

// all table definitions (their schemas)
import { NoteTable } from "@/drizzle/schema";

// Drop all notes for a user
export const dropAllNotes = (userId: string) => db.delete(NoteTable).where(eq(NoteTable.userId, userId));

// Retrieve all notes for a user, including only the essential fields, and shorten the content for preview purposes
export const getNotes = (userId: string) =>
  db
    .select({
      id: NoteTable.id,
      title: NoteTable.title,
      contentPreview: sql<string>`substring(${NoteTable.content} from 1 for 512)`,
      updatedAt: NoteTable.updatedAt,
    })
    .from(NoteTable)
    .where(eq(NoteTable.userId, userId));

// Get a single note for a user
export const getNote = (id: string, userId: string) =>
  db
    .select()
    .from(NoteTable)
    .where(and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)));

// Insert a new note for a user
export const insertNote = (userId: string, data: Omit<typeof NoteTable.$inferInsert, "userId">) =>
  db
    .insert(NoteTable)
    .values({ userId, ...data })
    .returning({ id: NoteTable.id });

// Update a note for a user
export const updateNote = (id: string, userId: string, data: Partial<Omit<typeof NoteTable.$inferInsert, "id" | "userId">>) =>
  db
    .update(NoteTable)
    .set(data)
    .where(and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)));

// Delete a note for a user
export const deleteNote = (id: string, userId: string) => db.delete(NoteTable).where(and(eq(NoteTable.id, id), eq(NoteTable.userId, userId)));
