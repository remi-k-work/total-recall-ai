// services, features, and other libraries
import { Effect, Layer } from "effect";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { HttpServer } from "@effect/platform";
import { RpcDashboard } from "./requests";
import { Auth } from "@/features/auth/lib/auth";

const RpcDashboardLayer = RpcDashboard.toLayer({
  verifyEmail: () =>
    Effect.gen(function* () {
      // Access the user session data from the server side or fail with an unauthorized access error
      const auth = yield* Auth;
      const {
        user: { email },
      } = yield* auth.getUserSessionData;

      // Assert that the current user has at least one of the allowed roles
      yield* auth.assertRoles(["user", "admin"]);

      // Trigger the email verification process manually for this user through the better-auth api
      yield* auth.sendVerificationEmail(email);
    }),
}).pipe(Layer.provide(Auth.Default));

export const { dispose, handler } = RpcServer.toWebHandler(RpcDashboard, {
  layer: Layer.mergeAll(RpcDashboardLayer, RpcSerialization.layerNdjson, HttpServer.layerContext),
});
