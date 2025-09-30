// drizzle and db access
import { index, integer, pgTable, text, uuid, vector } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "@/drizzle/helpers";
import { relations } from "drizzle-orm";

// all table definitions (their schemas)
import { NoteTable } from "./note";

export const NoteChunkTable = pgTable(
  "note_chunk",
  {
    id,
    noteId: uuid()
      .notNull()
      .references(() => NoteTable.id, { onDelete: "cascade" }),
    chunkIndex: integer().notNull(),
    text: text().notNull(),
    embedding: vector({ dimensions: 768 }),
    createdAt,
    updatedAt,
  },
  (table) => [index("embedding_index").using("hnsw", table.embedding.op("vector_cosine_ops"))],
);

export const noteChunkRelations = relations(NoteChunkTable, ({ one }) => ({
  note: one(NoteTable, { fields: [NoteChunkTable.noteId], references: [NoteTable.id] }),
}));
