// services, features, and other libraries
import { Layer, Logger, ManagedRuntime } from "effect";
import { Atom } from "@effect-atom/atom-react";

const MainLayer = Layer.mergeAll(Logger.pretty);

export const RuntimeClient = ManagedRuntime.make(MainLayer);
export const RuntimeAtom = Atom.runtime(MainLayer);
