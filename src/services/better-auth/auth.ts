// services, features, and other libraries
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

// drizzle and db access
import { db } from "@/drizzle/db";

// all table definitions (their schemas)
import { UserTable, SessionTable, AccountTable, VerificationTable } from "@/drizzle/schema";

// emails
import { sendEmailChange, sendResetPassword, sendVerifyEmail } from "@/emails/sender";

// types
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: UserTable, session: SessionTable, account: AccountTable, verification: VerificationTable },
  }),
  appName: "total-recall-ai",
  plugins: [nextCookies()],

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user: { email }, url }) => {
      await sendResetPassword(email, url);
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user: { email }, url }) => {
      await sendVerifyEmail(email, url);
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user: { email }, newEmail, url }) => {
        await sendEmailChange(email, newEmail, url);
      },
    },
  },
});
