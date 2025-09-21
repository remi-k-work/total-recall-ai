// drizzle and db access
import { relations } from "drizzle-orm";

// all table definitions (their schemas)
import { UserTable } from "./auth";
import { AvatarTable } from "./avatar";

export const userRelations = relations(UserTable, ({ one }) => ({ avatar: one(AvatarTable, { fields: [UserTable.id], references: [AvatarTable.userId] }) }));
