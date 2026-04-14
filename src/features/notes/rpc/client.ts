// services, features, and other libraries
import { Effect, Layer } from "effect";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { FetchHttpClient } from "@effect/platform";
import { RpcNotes } from "./requests";

const ProtocolLive = RpcClient.layerProtocolHttp({ url: "/api/rpc/notes" }).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerNdjson]));

export class RpcNotesClient extends Effect.Service<RpcNotesClient>()("RpcNotesClient", {
  dependencies: [ProtocolLive],
  scoped: RpcClient.make(RpcNotes),
}) {}
