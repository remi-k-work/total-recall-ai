// drizzle and db access
import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// all table definitions (their schemas)
import { NoteTable } from "./note";
import { NoteTagTable } from "./noteTag";

export const NoteToNoteTagTable = pgTable(
  "note_to_note_tag",
  {
    noteId: uuid()
      .notNull()
      .references(() => NoteTable.id, { onDelete: "cascade" }),
    noteTagId: uuid()
      .notNull()
      .references(() => NoteTagTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    // Composite primary key prevents duplicate links
    primaryKey({ columns: [table.noteId, table.noteTagId] }),

    // Allows fast lookup of all notes belonging to a specific tag (reverse lookup)
    index("note_tag_id_idx").on(table.noteTagId),
  ],
);

export const noteToNoteTagRelations = relations(NoteToNoteTagTable, ({ one }) => ({
  note: one(NoteTable, { fields: [NoteToNoteTagTable.noteId], references: [NoteTable.id] }),
  noteTag: one(NoteTagTable, { fields: [NoteToNoteTagTable.noteTagId], references: [NoteTagTable.id] }),
}));
