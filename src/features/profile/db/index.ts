// drizzle and db access
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

// all table definitions (their schemas)
import { AvatarTable } from "@/drizzle/schema";

// Obtain the avatar file key for a user, which is unique to their avatar file in uploadthing
export const getAvatarFileKey = (userId: string) => db.query.AvatarTable.findFirst({ where: eq(AvatarTable.userId, userId), columns: { fileKey: true } });

// Upsert an avatar for a user
export const upsertAvatar = (userId: string, data: Omit<typeof AvatarTable.$inferInsert, "userId">) =>
  db
    .insert(AvatarTable)
    .values({ userId, ...data })
    .onConflictDoUpdate({ target: AvatarTable.userId, set: data });

// Update an avatar for a user
export const updateAvatar = (userId: string, data: Partial<Omit<typeof AvatarTable.$inferInsert, "userId">>) =>
  db.update(AvatarTable).set(data).where(eq(AvatarTable.userId, userId));

// Delete an avatar for a user
export const deleteAvatar = (userId: string) => db.delete(AvatarTable).where(eq(AvatarTable.userId, userId));
