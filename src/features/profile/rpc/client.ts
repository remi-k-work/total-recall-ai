// services, features, and other libraries
import { Effect, Layer } from "effect";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { FetchHttpClient } from "@effect/platform";
import { RpcProfile } from "./requests";

const ProtocolLive = RpcClient.layerProtocolHttp({ url: "/api/rpc/profile" }).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerNdjson]));

export class RpcProfileClient extends Effect.Service<RpcProfileClient>()("RpcProfileClient", {
  dependencies: [ProtocolLive],
  scoped: RpcClient.make(RpcProfile),
}) {}
