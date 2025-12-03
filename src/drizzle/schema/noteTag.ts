// drizzle and db access
import { pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "@/drizzle/helpers";
import { relations } from "drizzle-orm";

// all table definitions (their schemas)
import { UserTable } from "./auth";
import { NoteToNoteTagTable } from "./noteToNoteTag";

export const NoteTagTable = pgTable(
  "note_tag",
  {
    id,
    userId: text()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    name: varchar({ length: 50 }).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    // This index enhances the efficiency of searching for a specific tag by name for users and prevents the duplication of tag names
    uniqueIndex("user_id_name_idx").on(table.userId, table.name),
  ],
);

export const noteTagRelations = relations(NoteTagTable, ({ many }) => ({
  noteToNoteTag: many(NoteToNoteTagTable),
}));
