// drizzle and db access
import { index, pgTable, text, uuid, vector } from "drizzle-orm/pg-core";
import { id } from "@/drizzle/helpers";
import { relations } from "drizzle-orm";

// all table definitions (their schemas)
import { UserTable } from "./auth";
import { NoteTable } from "./note";

export const NoteChunkTable = pgTable(
  "note_chunk",
  {
    id,
    userId: text()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    noteId: uuid()
      .notNull()
      .references(() => NoteTable.id, { onDelete: "cascade" }),
    chunk: text().notNull(),
    embedding: vector({ dimensions: 768 }),
  },
  (table) => [index("user_id_idx").on(table.userId), index("embedding_idx").using("hnsw", table.embedding.op("vector_cosine_ops"))],
);

export const noteChunkRelations = relations(NoteChunkTable, ({ one }) => ({
  user: one(UserTable, { fields: [NoteChunkTable.userId], references: [UserTable.id] }),
  note: one(NoteTable, { fields: [NoteChunkTable.noteId], references: [NoteTable.id] }),
}));
