// drizzle and db access
import { AvatarDB } from "@/features/profile/db";

// services, features, and other libraries
import { Effect, Layer } from "effect";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { HttpServer } from "@effect/platform";
import { RpcProfile } from "./requests";
import { Auth } from "@/features/auth/lib/auth";

const RpcProfileLayer = RpcProfile.toLayer({
  deleteAvatar: () =>
    Effect.gen(function* () {
      // Access the user session data from the server side or fail with an unauthorized access error
      const auth = yield* Auth;
      const {
        user: { id: userId },
      } = yield* auth.getUserSessionData;

      // Assert that the current user has at least one of the allowed roles
      yield* auth.assertRoles(["user", "admin"]);

      // Update the user information through the better-auth api by setting their image to null
      yield* auth.deleteImage;

      // Obtain the avatar file key for a user, which is unique to their avatar file in uploadthing
      const avatarDB = yield* AvatarDB;
      const avatarFileKey = yield* avatarDB.getAvatarFileKey(userId);

      // Delete the old avatar file from uploadthing
      if (avatarFileKey) yield* avatarDB.deleteOldAvatar(avatarFileKey.fileKey);

      // Delete an avatar for a user
      yield* avatarDB.deleteAvatar(userId);
    }),

  emailChangeForm: ({ newEmail }) =>
    Effect.gen(function* () {
      // Access the user session data from the server side or fail with an unauthorized access error
      const auth = yield* Auth;
      const {
        user: { emailVerified },
      } = yield* auth.getUserSessionData;

      // Assert that the current user has at least one of the allowed roles
      yield* auth.assertRoles(["user", "admin"]);

      // Only users with verified emails need to additionally approve their email change
      const needsApproval = emailVerified;

      // Request the email change through the better-auth api for the user
      yield* auth.changeEmail(newEmail, needsApproval);
    }),

  passChangeForm: ({ newPassword, currentPassword }) =>
    Effect.gen(function* () {
      // Assert that the current user has at least one of the allowed roles
      const auth = yield* Auth;
      yield* auth.assertRoles(["user", "admin"]);

      // Setup or change the password through the better-auth api for the user
      yield* auth.setupOrChangePassword(newPassword, currentPassword);
    }),

  profileDetailsForm: ({ name }) =>
    Effect.gen(function* () {
      // Assert that the current user has at least one of the allowed roles
      const auth = yield* Auth;
      yield* auth.assertRoles(["user", "admin"]);

      // Update the user information through the better-auth api by setting their name
      yield* auth.updateName(name);
    }),

  signOutEverywhere: () =>
    Effect.gen(function* () {
      // Access the user session data from the server side or fail with an unauthorized access error
      const auth = yield* Auth;
      yield* auth.getUserSessionData;

      // Sign the user out from all devices through the better-auth api
      yield* auth.revokeSessions;
    }),
}).pipe(Layer.provide(Auth.Default), Layer.provide(AvatarDB.Default));

export const { dispose, handler } = RpcServer.toWebHandler(RpcProfile, {
  layer: Layer.mergeAll(RpcProfileLayer, RpcSerialization.layerNdjson, HttpServer.layerContext),
});
