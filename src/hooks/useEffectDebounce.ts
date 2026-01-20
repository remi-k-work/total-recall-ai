// react
import { useEffect, useMemo, useCallback, useEffectEvent } from "react";

// services, features, and other libraries
import { Effect, Fiber, Queue, Stream } from "effect";
import { RuntimeClient } from "@/lib/RuntimeClient";

// types
import type { DurationInput } from "effect/Duration";

// A reusable hook that debounces an action using effect streams
export function useEffectDebounce<T>(action: (value: T) => void, delay: DurationInput) {
  // Function to be called when the action needs to be triggered
  const onAction = useEffectEvent(action);

  // Create a stable queue for this specific component instance
  const queue = useMemo(() => RuntimeClient.runSync(Queue.unbounded<T>()), []);

  useEffect(() => {
    // Build the stream pipeline: queue -> debounce -> action
    const stream = Stream.fromQueue(queue).pipe(
      Stream.debounce(delay),
      Stream.changes,
      Stream.runForEach((value) => Effect.sync(() => onAction(value))),
    );

    // Fork the stream into a background fiber
    const streamFiber = RuntimeClient.runFork(stream);

    // Interrupt the fiber when the component unmounts
    return () => {
      RuntimeClient.runPromise(Fiber.interrupt(streamFiber));
    };
  }, [delay, queue]);

  // Return a stable 'push' function to trigger the debounce
  return useCallback(
    (value: T) => {
      RuntimeClient.runSync(Queue.offer(queue, value));
    },
    [queue],
  );
}
