// services, features, and other libraries
import { Effect, Layer } from "effect";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { FetchHttpClient } from "@effect/platform";
import { RpcDashboard } from "./requests";

const ProtocolLive = RpcClient.layerProtocolHttp({ url: "/api/rpc/dashboard" }).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerNdjson]));

export class RpcDashboardClient extends Effect.Service<RpcDashboardClient>()("RpcDashboardClient", {
  dependencies: [ProtocolLive],
  scoped: RpcClient.make(RpcDashboard),
}) {}
