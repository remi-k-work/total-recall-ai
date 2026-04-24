// services, features, and other libraries
import { Schema } from "effect";
import { Rpc, RpcGroup } from "@effect/rpc";
import { BetterAuthApiError, UnauthorizedAccessError } from "@/lib/errors";

export class RpcDashboard extends RpcGroup.make(
  Rpc.make("verifyEmail", {
    error: Schema.Union(BetterAuthApiError, UnauthorizedAccessError),
  }),
) {}
