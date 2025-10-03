// drizzle and db access
import { relations } from "drizzle-orm";

// all table definitions (their schemas)
import { UserTable } from "./auth";
import { AvatarTable } from "./avatar";
import { NoteTable } from "./note";
import { NoteChunkTable } from "./noteChunk";

export const userRelations = relations(UserTable, ({ one, many }) => ({
  avatar: one(AvatarTable, { fields: [UserTable.id], references: [AvatarTable.userId] }),
  notes: many(NoteTable),
  noteChunks: many(NoteChunkTable),
}));
