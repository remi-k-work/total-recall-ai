// services, features, and other libraries
import { Schema } from "effect";
import { Rpc, RpcGroup } from "@effect/rpc";
import { BetterAuthApiError } from "@/lib/errors";

// schemas
import { EmailField, NameField, PasswordField } from "@/schemas";
import { RememberMeField } from "@/features/auth/schemas";

export class RpcAuth extends RpcGroup.make(
  Rpc.make("forgotPassForm", {
    error: BetterAuthApiError,
    payload: { email: EmailField().schema },
  }),

  Rpc.make("resetPassForm", {
    error: BetterAuthApiError,
    payload: { token: Schema.Trim.pipe(Schema.nonEmptyString()), newPassword: PasswordField().schema },
  }),

  Rpc.make("signInForm", {
    error: BetterAuthApiError,
    payload: { email: EmailField().schema, password: PasswordField().schema, rememberMe: RememberMeField.schema },
  }),

  Rpc.make("signUpForm", {
    error: BetterAuthApiError,
    payload: { name: NameField().schema, email: EmailField().schema, password: PasswordField().schema },
  }),
) {}
