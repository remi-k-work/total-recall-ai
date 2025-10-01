// drizzle and db access
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

// all table definitions (their schemas)
import { NoteChunkTable, NoteTable } from "@/drizzle/schema";

// Insert a new note for a user
export const insertNote = (userId: string, data: Omit<typeof NoteTable.$inferInsert, "userId">) =>
  db
    .insert(NoteTable)
    .values({ userId, ...data })
    .returning({ id: NoteTable.id });

// Update a note for a user
export const updateNote = (id: string, data: Partial<Omit<typeof NoteTable.$inferInsert, "id">>) => db.update(NoteTable).set(data).where(eq(NoteTable.id, id));

// Delete a note for a user
export const deleteNote = (id: string) => db.delete(NoteTable).where(eq(NoteTable.id, id));

// Insert a single new note chunk for a note
export const insertNoteChunk = (noteId: string, data: Omit<typeof NoteChunkTable.$inferInsert, "noteId">) =>
  db
    .insert(NoteChunkTable)
    .values({ noteId, ...data })
    .returning({ id: NoteChunkTable.id });

// Insert multiple new note chunks for a note
export const insertNoteChunks = (noteId: string, data: Omit<typeof NoteChunkTable.$inferInsert, "noteId">[]) =>
  db
    .insert(NoteChunkTable)
    .values(data.map((item) => ({ noteId, ...item })))
    .returning({ id: NoteChunkTable.id });
