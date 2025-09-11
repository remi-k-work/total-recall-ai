// drizzle and db access
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const TestTable = pgTable("test", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  experienceLevel: varchar({ length: 255 }).notNull(),
});
