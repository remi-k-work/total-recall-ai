// drizzle and db access
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

// all table definitions (their schemas)
import { AvatarTable } from "@/drizzle/schema";

// Obtain the avatar file key for a user, which is unique to their avatar file in uploadthing
export async function getAvatarFileKey(userId: string): Promise<string | undefined> {
  return (await db.select({ fileKey: AvatarTable.fileKey }).from(AvatarTable).where(eq(AvatarTable.userId, userId)))[0]?.fileKey;
}

// Upsert an avatar for a user
export async function upsertAvatar(userId: string, data: Omit<typeof AvatarTable.$inferInsert, "userId">) {
  await db
    .insert(AvatarTable)
    .values({ userId, ...data })
    .onConflictDoUpdate({ target: AvatarTable.userId, set: data });
}

// Update an avatar for a user
export async function updateAvatar(userId: string, data: Partial<Omit<typeof AvatarTable.$inferInsert, "userId">>) {
  await db.update(AvatarTable).set(data).where(eq(AvatarTable.userId, userId));
}
