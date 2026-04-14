// services, features, and other libraries
import { Layer, Logger, ManagedRuntime } from "effect";
import { Atom } from "@effect-atom/atom-react";
import { RpcNotesClient } from "@/features/notes/rpc/client";

const MainLayer = Layer.mergeAll(Logger.pretty, RpcNotesClient.Default);

export const RuntimeClient = ManagedRuntime.make(MainLayer);
export const RuntimeAtom = Atom.runtime(MainLayer);
