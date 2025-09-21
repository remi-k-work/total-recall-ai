// drizzle and db access
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "@/drizzle/helpers";
import { relations } from "drizzle-orm";

// all table definitions (their schemas)
import { UserTable } from "./auth";

export const AvatarTable = pgTable("avatar", {
  userId: text()
    .primaryKey()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  fileKey: varchar().notNull().unique(),
  fileUrl: varchar().notNull(),
  createdAt,
  updatedAt,
});

export const avatarRelations = relations(AvatarTable, ({ one }) => ({ user: one(UserTable, { fields: [AvatarTable.userId], references: [UserTable.id] }) }));
