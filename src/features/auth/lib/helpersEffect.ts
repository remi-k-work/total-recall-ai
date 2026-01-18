// next
import { headers } from "next/headers";

// services, features, and other libraries
import { Data, Effect } from "effect";
import { auth } from "@/services/better-auth/auth";

// Define a domain error for the unauthorized access
class UnauthorizedAccessError extends Data.TaggedError("UnauthorizedAccessError")<{ readonly message: string; readonly cause?: unknown }> {}

// Access the user session data from the server side or fail with an unauthorized access error
export const getUserSessionData = Effect.gen(function* () {
  const headers = yield* getHeaders;
  return yield* Effect.fromNullable(yield* Effect.promise<Awaited<ReturnType<typeof auth.api.getSession>>>(() => auth.api.getSession({ headers }))).pipe(
    Effect.mapError((cause) => new UnauthorizedAccessError({ message: "Unauthorized access", cause })),
  );
});

// List all accounts associated with the current user
export const listUserAccounts = Effect.gen(function* () {
  const headers = yield* getHeaders;
  return yield* Effect.promise<Awaited<ReturnType<typeof auth.api.listUserAccounts>>>(() => auth.api.listUserAccounts({ headers }));
});

// Determine whether the current user has any "credential" type accounts
export const hasCredentialAccount = Effect.gen(function* () {
  return (yield* listUserAccounts).some((account) => account.providerId === "credential");
});

const getHeaders = Effect.promise<Awaited<ReturnType<typeof headers>>>(() => headers());
