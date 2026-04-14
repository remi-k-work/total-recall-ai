// drizzle and db access
import { NoteDB } from "@/features/notes/db";

// services, features, and other libraries
import { Effect, Layer } from "effect";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { HttpServer } from "@effect/platform";
import { RpcNotes } from "./requests";
import { Auth } from "@/features/auth/lib/auth";

const RpcNotesLayer = RpcNotes.toLayer({
  syncToDbNotePrefs: ({ noteId, color, posX, posY, isPinned }) =>
    Effect.gen(function* () {
      // Access the user session data from the server side or fail with an unauthorized access error
      const auth = yield* Auth;
      const {
        user: { id: userId },
      } = yield* auth.getUserSessionData;

      // Update the preferences of a note for a user
      const noteDB = yield* NoteDB;
      yield* noteDB.updateNotePreferences(noteId, userId, { color, posX, posY, isPinned });
    }),
}).pipe(Layer.provide(Auth.Default), Layer.provide(NoteDB.Default));

export const { dispose, handler } = RpcServer.toWebHandler(RpcNotes, {
  layer: Layer.mergeAll(RpcNotesLayer, RpcSerialization.layerNdjson, HttpServer.layerContext),
});
