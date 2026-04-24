// drizzle and db access
import { DB } from "@/drizzle/dbEffect";
import { eq } from "drizzle-orm";

// services, features, and other libraries
import { Effect } from "effect";
import { utApi } from "@/services/uploadthing/utApi";
import { UtApiError } from "@/lib/errors";

// all table definitions (their schemas)
import { AvatarTable } from "@/drizzle/schema";

export class AvatarDB extends Effect.Service<AvatarDB>()("AvatarDB", {
  dependencies: [DB.Default],

  effect: Effect.gen(function* () {
    const { execute } = yield* DB;

    // Obtain the avatar file key for a user, which is unique to their avatar file in uploadthing
    const getAvatarFileKey = (userId: string) =>
      execute((dbOrTx) => dbOrTx.query.AvatarTable.findFirst({ columns: { fileKey: true }, where: eq(AvatarTable.userId, userId) }));

    // Delete the old avatar file from uploadthing
    const deleteOldAvatar = (fileKey: string) =>
      Effect.tryPromise({
        try: () => utApi.deleteFiles(fileKey),
        catch: (cause) => new UtApiError({ message: "Failed to delete old avatar", cause }),
      }).pipe(Effect.asVoid);

    // Upsert an avatar for a user
    const upsertAvatar = (userId: string, data: Omit<typeof AvatarTable.$inferInsert, "userId">) =>
      execute((dbOrTx) =>
        dbOrTx
          .insert(AvatarTable)
          .values({ userId, ...data })
          .onConflictDoUpdate({ target: AvatarTable.userId, set: data }),
      );

    // Update an avatar for a user
    const updateAvatar = (userId: string, data: Partial<Omit<typeof AvatarTable.$inferInsert, "userId">>) =>
      execute((dbOrTx) => dbOrTx.update(AvatarTable).set(data).where(eq(AvatarTable.userId, userId)));

    // Delete an avatar for a user
    const deleteAvatar = (userId: string) => execute((dbOrTx) => dbOrTx.delete(AvatarTable).where(eq(AvatarTable.userId, userId)));

    return { getAvatarFileKey, deleteOldAvatar, upsertAvatar, updateAvatar, deleteAvatar } as const;
  }),
}) {}
