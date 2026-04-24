// services, features, and other libraries
import { Effect, Layer } from "effect";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { HttpServer } from "@effect/platform";
import { RpcAuth } from "./requests";
import { Auth } from "@/features/auth/lib/auth";

const RpcAuthLayer = RpcAuth.toLayer({
  forgotPassForm: ({ email }) =>
    Effect.gen(function* () {
      // Request the password reset through the better-auth api for the user
      const auth = yield* Auth;
      yield* auth.requestPasswordReset(email);
    }),

  resetPassForm: ({ token, newPassword }) =>
    Effect.gen(function* () {
      // Reset the password through the better-auth api for the user
      const auth = yield* Auth;
      yield* auth.resetPassword(token, newPassword);
    }),

  signInForm: ({ email, password, rememberMe }) =>
    Effect.gen(function* () {
      // Sign in the user through the better-auth api
      const auth = yield* Auth;
      yield* auth.signInEmail(email, password, rememberMe);
    }),

  signUpForm: ({ name, email, password }) =>
    Effect.gen(function* () {
      // Sign up the user through the better-auth api
      const auth = yield* Auth;
      yield* auth.signUpEmail(name, email, password);
    }),
}).pipe(Layer.provide(Auth.Default));

export const { dispose, handler } = RpcServer.toWebHandler(RpcAuth, {
  layer: Layer.mergeAll(RpcAuthLayer, RpcSerialization.layerNdjson, HttpServer.layerContext),
});
