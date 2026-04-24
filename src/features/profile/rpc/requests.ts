// services, features, and other libraries
import { Schema } from "effect";
import { Rpc, RpcGroup } from "@effect/rpc";
import { BetterAuthApiError, DatabaseError, UnauthorizedAccessError, UtApiError } from "@/lib/errors";

// schemas
import { EmailField, NameField, PasswordField } from "@/schemas";

export class RpcProfile extends RpcGroup.make(
  Rpc.make("deleteAvatar", {
    error: Schema.Union(BetterAuthApiError, DatabaseError, UnauthorizedAccessError, UtApiError),
  }),

  Rpc.make("emailChangeForm", {
    error: Schema.Union(BetterAuthApiError, UnauthorizedAccessError),
    payload: { newEmail: EmailField().schema },
  }),

  Rpc.make("passChangeForm", {
    error: Schema.Union(BetterAuthApiError, UnauthorizedAccessError),
    payload: { newPassword: PasswordField().schema, currentPassword: Schema.optional(PasswordField().schema) },
  }),

  Rpc.make("profileDetailsForm", {
    error: Schema.Union(BetterAuthApiError, UnauthorizedAccessError),
    payload: { name: NameField().schema },
  }),

  Rpc.make("signOutEverywhere", {
    error: Schema.Union(BetterAuthApiError, UnauthorizedAccessError),
  }),
) {}
