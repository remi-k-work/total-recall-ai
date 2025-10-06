// drizzle and db access
import { db } from "@/drizzle/db";

// all table definitions (their schemas)
import { NoteChunkTable } from "@/drizzle/schema";

// types
import type { DbOrTx } from "@/drizzle/db";

// Insert a single new note chunk for a note and the current user (supports normal db or transaction)
export const insertNoteChunk = (userId: string, noteId: string, data: Omit<typeof NoteChunkTable.$inferInsert, "userId" | "noteId">, tx: DbOrTx = db) =>
  tx.insert(NoteChunkTable).values({ userId, noteId, ...data });

// Insert multiple new note chunks for a note and the current user (supports normal db or transaction)
export const insertNoteChunks = (userId: string, noteId: string, data: Omit<typeof NoteChunkTable.$inferInsert, "userId" | "noteId">[], tx: DbOrTx = db) =>
  tx.insert(NoteChunkTable).values(data.map((item) => ({ userId, noteId, ...item })));
