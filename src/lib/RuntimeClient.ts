// services, features, and other libraries
import { Layer, Logger, ManagedRuntime } from "effect";
import { Atom } from "@effect-atom/atom-react";
import { RpcNotesClient } from "@/features/notes/rpc/client";
import { RpcAuthClient } from "@/features/auth/rpc/client";
import { RpcProfileClient } from "@/features/profile/rpc/client";
import { RpcDashboardClient } from "@/features/dashboard/rpc/client";

const MainLayer = Layer.mergeAll(Logger.pretty, RpcNotesClient.Default, RpcAuthClient.Default, RpcProfileClient.Default, RpcDashboardClient.Default);

export const RuntimeClient = ManagedRuntime.make(MainLayer);
export const RuntimeAtom = Atom.runtime(MainLayer);
