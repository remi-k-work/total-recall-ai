// drizzle and db access
import { DB } from "@/drizzle/dbEffect";
import { NoteChunkDB, NoteDB, NoteTagDB } from "@/features/notes/db";

// services, features, and other libraries
import { Effect, Layer } from "effect";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { HttpServer } from "@effect/platform";
import { RpcNotes } from "./requests";
import { Auth } from "@/features/auth/lib/auth";
import { generateNoteEmbeddings } from "@/features/notes/lib/embeddings3";

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

  syncToDbNoteTags: ({ noteId, tags }) =>
    Effect.gen(function* () {
      // Access the user session data from the server side or fail with an unauthorized access error
      const auth = yield* Auth;
      yield* auth.getUserSessionData;

      // Sync tags for a note (useful when the UI sends a full list of tags)
      const noteTagDB = yield* NoteTagDB;
      yield* noteTagDB.syncNoteTags(noteId, tags);
    }),

  newNoteForm: ({ title, content }) =>
    Effect.gen(function* () {
      // Access the user session data from the server side or fail with an unauthorized access error
      const auth = yield* Auth;
      const {
        user: { id: userId },
      } = yield* auth.getUserSessionData;

      // Assert that the current user has at least one of the allowed roles
      yield* auth.assertRoles(["user", "admin"]);

      const db = yield* DB;
      const noteDB = yield* NoteDB;
      const noteChunkDB = yield* NoteChunkDB;

      // Generate embeddings for a note first; it is an external api call that may throw and is time-consuming (no db lock held)
      const noteEmbeddings = yield* generateNoteEmbeddings(content);

      // Run all db operations in a transaction
      yield* db.transaction(
        // Insert a new note, and insert multiple new chunks for a note
        noteDB.insertNote(userId, { title, content }).pipe(Effect.andThen(([{ id: noteId }]) => noteChunkDB.insertChunks(userId, noteId, noteEmbeddings)))
      );
    }),

  editNoteForm: ({ noteId, title, content }) =>
    Effect.gen(function* () {
      // Access the user session data from the server side or fail with an unauthorized access error
      const auth = yield* Auth;
      const {
        user: { id: userId },
      } = yield* auth.getUserSessionData;

      // Assert that the current user has at least one of the allowed roles
      yield* auth.assertRoles(["user", "admin"]);

      const db = yield* DB;
      const noteDB = yield* NoteDB;
      const noteChunkDB = yield* NoteChunkDB;

      // Generate embeddings for a note first; it is an external api call that may throw and is time-consuming (no db lock held)
      const noteEmbeddings = yield* generateNoteEmbeddings(content);

      // Run all db operations in a transaction
      yield* db.transaction(
        // Update a note, delete all chunks for a note, and insert multiple new chunks for a note
        noteDB
          .updateNote(noteId, userId, { title, content })
          .pipe(Effect.andThen(noteChunkDB.deleteChunks(userId, noteId)), Effect.andThen(noteChunkDB.insertChunks(userId, noteId, noteEmbeddings)))
      );
    }),

  deleteNote: ({ noteId }) =>
    Effect.gen(function* () {
      // Access the user session data from the server side or fail with an unauthorized access error
      const auth = yield* Auth;
      const {
        user: { id: userId },
      } = yield* auth.getUserSessionData;

      // Assert that the current user has at least one of the allowed roles
      yield* auth.assertRoles(["user", "admin"]);

      // Delete a note for a user
      const noteDB = yield* NoteDB;
      yield* noteDB.deleteNote(noteId, userId);
    }),
}).pipe(
  Layer.provide(Auth.Default),
  Layer.provide(DB.Default),
  Layer.provide(NoteDB.Default),
  Layer.provide(NoteTagDB.Default),
  Layer.provide(NoteChunkDB.Default)
);

export const { dispose, handler } = RpcServer.toWebHandler(RpcNotes, {
  layer: Layer.mergeAll(RpcNotesLayer, RpcSerialization.layerNdjson, HttpServer.layerContext),
});
