// services, features, and other libraries
import { Schema } from "effect";
import { Rpc, RpcGroup } from "@effect/rpc";
import { DatabaseError, UnauthorizedAccessError } from "@/lib/errors";

export class RpcNotes extends RpcGroup.make(
  Rpc.make("syncToDbNotePrefs", {
    error: Schema.Union(DatabaseError, UnauthorizedAccessError),
    payload: {
      noteId: Schema.UUID,
      color: Schema.Union(Schema.Trim.pipe(Schema.nonEmptyString()), Schema.Null),
      posX: Schema.Union(Schema.NonNegativeInt, Schema.Null),
      posY: Schema.Union(Schema.NonNegativeInt, Schema.Null),
      isPinned: Schema.Boolean,
    },
  }),

  Rpc.make("syncToDbNoteTags", {
    error: Schema.Union(DatabaseError, UnauthorizedAccessError),
    payload: { noteId: Schema.UUID, tags: Schema.Array(Schema.UUID) },
  })
) {}
