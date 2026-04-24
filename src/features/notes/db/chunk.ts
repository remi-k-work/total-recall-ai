// drizzle and db access
import { DB } from "@/drizzle/dbEffect";
import { and, eq } from "drizzle-orm";

// services, features, and other libraries
import { Effect } from "effect";

// all table definitions (their schemas)
import { NoteChunkTable } from "@/drizzle/schema";

export class NoteChunkDB extends Effect.Service<NoteChunkDB>()("NoteChunkDB", {
  dependencies: [DB.Default],

  effect: Effect.gen(function* () {
    const { execute } = yield* DB;

    // Get a single chunk
    const getChunk = (id: string) => execute((dbOrTx) => dbOrTx.query.NoteChunkTable.findFirst({ where: eq(NoteChunkTable.id, id) }));

    // Insert a new chunk for a note
    const insertChunk = (userId: string, noteId: string, data: Omit<typeof NoteChunkTable.$inferInsert, "userId" | "noteId">) =>
      execute((dbOrTx) => dbOrTx.insert(NoteChunkTable).values({ userId, noteId, ...data }));

    // Insert multiple new chunks for a note
    const insertChunks = (userId: string, noteId: string, data: Omit<typeof NoteChunkTable.$inferInsert, "userId" | "noteId">[]) =>
      execute((dbOrTx) => dbOrTx.insert(NoteChunkTable).values(data.map((chunk) => ({ userId, noteId, ...chunk }))));

    // Delete all chunks for a note
    const deleteChunks = (userId: string, noteId: string) =>
      execute((dbOrTx) => dbOrTx.delete(NoteChunkTable).where(and(eq(NoteChunkTable.userId, userId), eq(NoteChunkTable.noteId, noteId))));

    return { getChunk, insertChunk, insertChunks, deleteChunks } as const;
  }),
}) {}
