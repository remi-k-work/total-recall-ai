// services, features, and other libraries
import { Effect, Layer } from "effect";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { FetchHttpClient } from "@effect/platform";
import { RpcAuth } from "./requests";

const ProtocolLive = RpcClient.layerProtocolHttp({ url: "/api/rpc/auth" }).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerNdjson]));

export class RpcAuthClient extends Effect.Service<RpcAuthClient>()("RpcAuthClient", {
  dependencies: [ProtocolLive],
  scoped: RpcClient.make(RpcAuth),
}) {}
