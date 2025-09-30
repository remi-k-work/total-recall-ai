// drizzle and db access
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "@/drizzle/helpers";
import { relations } from "drizzle-orm";

// all table definitions (their schemas)
import { UserTable } from "./auth";
import { NoteChunkTable } from "./noteChunk";

export const NoteTable = pgTable("note", {
  id,
  userId: text()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  title: varchar(),
  content: text().notNull(),
  createdAt,
  updatedAt,
});

export const noteRelations = relations(NoteTable, ({ one, many }) => ({
  user: one(UserTable, { fields: [NoteTable.userId], references: [UserTable.id] }),
  noteChunks: many(NoteChunkTable),
}));
