// services, features, and other libraries
import { Layer, Logger, ManagedRuntime } from "effect";

const MainLayer = Layer.mergeAll(Logger.pretty);

export const RuntimeClient = ManagedRuntime.make(MainLayer);
