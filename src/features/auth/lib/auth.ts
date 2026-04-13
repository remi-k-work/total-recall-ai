// next
import { headers } from "next/headers";

// services, features, and other libraries
import { Array, Effect, Option } from "effect";
import { auth } from "@/services/better-auth/auth";
import { BetterAuthApiError, UnauthorizedAccessError } from "@/lib/errors";

// types
import type { Permissions, Role } from "@/services/better-auth/auth";

export class Auth extends Effect.Service<Auth>()("Auth", {
  effect: Effect.gen(function* () {
    // Set user role
    const setUserRole = (userId: string, role: Role) =>
      Effect.gen(function* () {
        const headers = yield* getHeaders;
        yield* Effect.tryPromise({
          try: () => auth.api.setRole({ body: { userId, role }, headers }),
          catch: (cause) => new BetterAuthApiError({ message: "Failed to set user role", cause }),
        });
      });

    // Remove user
    const removeUser = (userId: string) =>
      Effect.gen(function* () {
        const headers = yield* getHeaders;
        yield* Effect.tryPromise({
          try: () => auth.api.removeUser({ body: { userId }, headers }),
          catch: (cause) => new BetterAuthApiError({ message: "Failed to remove user", cause }),
        });
      });

    // Request the password reset through the better-auth api for the user
    const requestPasswordReset = (email: string) =>
      Effect.tryPromise({
        try: () => auth.api.requestPasswordReset({ body: { email, redirectTo: "/reset-password" } }),
        catch: (cause) => new BetterAuthApiError({ message: "Failed to request password reset", cause }),
      }).pipe(Effect.asVoid);

    // Reset the password through the better-auth api for the user
    const resetPassword = (token: string, newPassword: string) =>
      Effect.tryPromise({
        try: () => auth.api.resetPassword({ body: { token, newPassword } }),
        catch: (cause) => new BetterAuthApiError({ message: "Failed to reset password", cause }),
      }).pipe(Effect.asVoid);

    // Sign in the user through the better-auth api
    const signInEmail = (email: string, password: string, rememberMe: boolean) =>
      Effect.gen(function* () {
        const headers = yield* getHeaders;
        yield* Effect.tryPromise({
          try: () => auth.api.signInEmail({ body: { email, password, rememberMe }, headers }),
          catch: (cause) => new BetterAuthApiError({ message: "Failed to sign in", cause }),
        });
      });

    // Sign up the user through the better-auth api
    const signUpEmail = (name: string, email: string, password: string) =>
      Effect.tryPromise({
        try: () => auth.api.signUpEmail({ body: { name, email, password } }),
        catch: (cause) => new BetterAuthApiError({ message: "Failed to sign up", cause }),
      }).pipe(Effect.asVoid);

    // Trigger the email verification process manually for this user through the better-auth api
    const sendVerificationEmail = (email: string) =>
      Effect.gen(function* () {
        const headers = yield* getHeaders;
        yield* Effect.tryPromise({
          try: () => auth.api.sendVerificationEmail({ body: { email, callbackURL: "/email-verified" }, headers }),
          catch: (cause) => new BetterAuthApiError({ message: "Failed to send verification email", cause }),
        });
      });

    // Update the user information through the better-auth api by setting their image to null
    const deleteImage = Effect.gen(function* () {
      const headers = yield* getHeaders;
      yield* Effect.tryPromise({
        try: () => auth.api.updateUser({ body: { image: null }, headers }),
        catch: (cause) => new BetterAuthApiError({ message: "Failed to update user image", cause }),
      });
    });

    // Request the email change through the better-auth api for the user
    const changeEmail = (newEmail: string, needsApproval: boolean) =>
      Effect.gen(function* () {
        const headers = yield* getHeaders;
        yield* Effect.tryPromise({
          try: () => auth.api.changeEmail({ body: { newEmail, callbackURL: needsApproval ? "/email-approved" : "/email-verified" }, headers }),
          catch: (cause) => new BetterAuthApiError({ message: "Failed to request email change", cause }),
        });
      });

    // Setup or change the password through the better-auth api for the user
    const setupOrChangePassword = (newPassword: string, currentPassword?: string) =>
      Effect.gen(function* () {
        const headers = yield* getHeaders;
        yield* Option.fromNullable(currentPassword).pipe(
          Option.match({
            onNone: () =>
              Effect.tryPromise({
                try: () => auth.api.setPassword({ body: { newPassword }, headers }),
                catch: (cause) => new BetterAuthApiError({ message: "Failed to setup password", cause }),
              }),
            onSome: (currentPassword) =>
              Effect.tryPromise({
                try: () => auth.api.changePassword({ body: { currentPassword, newPassword }, headers }),
                catch: (cause) => new BetterAuthApiError({ message: "Failed to change password", cause }),
              }),
          }),
        );
      });

    // Update the user information through the better-auth api by setting their name
    const updateName = (name: string) =>
      Effect.gen(function* () {
        const headers = yield* getHeaders;
        yield* Effect.tryPromise({
          try: () => auth.api.updateUser({ body: { name }, headers }),
          catch: (cause) => new BetterAuthApiError({ message: "Failed to update user name", cause }),
        });
      });

    // Sign the user out from all devices through the better-auth api
    const revokeSessions = Effect.gen(function* () {
      const headers = yield* getHeaders;
      yield* Effect.tryPromise({
        try: () => auth.api.revokeSessions({ headers }),
        catch: (cause) => new BetterAuthApiError({ message: "Failed to sign out", cause }),
      });
    });

    // Verify if the current user possesses specific permissions
    const assertPermissions = (permissions: Permissions) =>
      Effect.gen(function* () {
        const headers = yield* getHeaders;
        yield* Effect.tryPromise({
          try: () => auth.api.userHasPermission({ body: { permissions: { ...permissions } }, headers }),
          catch: (cause) => new BetterAuthApiError({ message: "Failed to verify permissions", cause }),
        }).pipe(
          Effect.filterOrFail(
            ({ success }) => success,
            () => new UnauthorizedAccessError({ message: "Unauthorized access" }),
          ),
        );
      });

    // Access the user session data from the server side or fail with an unauthorized access error
    const getUserSessionData = Effect.gen(function* () {
      const headers = yield* getHeaders;
      return yield* Effect.fromNullable(yield* Effect.promise(() => auth.api.getSession({ headers }))).pipe(
        Effect.mapError((cause) => new UnauthorizedAccessError({ message: "Unauthorized access", cause })),
      );
    });

    // List all accounts associated with the current user
    const listUserAccounts = Effect.gen(function* () {
      const headers = yield* getHeaders;
      return yield* Effect.promise(() => auth.api.listUserAccounts({ headers }));
    });

    // Determine whether the current user has any "credential" type accounts
    const hasCredentialAccount = listUserAccounts.pipe(Effect.map(Array.some((account) => account.providerId === "credential")));

    // Assert that the current user has at least one of the allowed roles
    const assertRoles = (roles: ReadonlyArray<Role>) =>
      getUserSessionData.pipe(
        Effect.filterOrFail(
          ({ user: { role } }) => Array.contains(roles, role),
          () => new UnauthorizedAccessError({ message: "Unauthorized access" }),
        ),
        Effect.asVoid,
      );

    return {
      setUserRole,
      removeUser,
      requestPasswordReset,
      resetPassword,
      signInEmail,
      signUpEmail,
      sendVerificationEmail,
      deleteImage,
      changeEmail,
      setupOrChangePassword,
      updateName,
      revokeSessions,
      assertPermissions,
      getUserSessionData,
      listUserAccounts,
      hasCredentialAccount,
      assertRoles,
    } as const;
  }),
}) {}

const getHeaders = Effect.promise(() => headers());
