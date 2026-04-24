// services, features, and other libraries
import { Schema } from "effect";
import { Rpc, RpcGroup } from "@effect/rpc";
import { AiSdkError, DatabaseError, UnauthorizedAccessError } from "@/lib/errors";

// schemas
import { ContentField, TitleField } from "@/features/notes/schemas";

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
  }),

  Rpc.make("newNoteForm", {
    error: Schema.Union(AiSdkError, DatabaseError, UnauthorizedAccessError),
    payload: { title: TitleField.schema, content: ContentField.schema },
  }),

  Rpc.make("editNoteForm", {
    error: Schema.Union(AiSdkError, DatabaseError, UnauthorizedAccessError),
    payload: { noteId: Schema.UUID, title: TitleField.schema, content: ContentField.schema },
  }),

  Rpc.make("deleteNote", {
    error: Schema.Union(DatabaseError, UnauthorizedAccessError),
    payload: { noteId: Schema.UUID },
  })
) {}
