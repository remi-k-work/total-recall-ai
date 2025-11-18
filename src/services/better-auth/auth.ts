// services, features, and other libraries
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, demo, user } from "./permissions";

// drizzle and db access
import { db } from "@/drizzle/db";

// all table definitions (their schemas)
import { UserTable, SessionTable, AccountTable, VerificationTable } from "@/drizzle/schema";

// emails
import { sendEmailChange, sendResetPassword, sendVerifyEmail } from "@/emails/sender";

// types
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000", "https://total-recall-ai.vercel.app", "https://total-recall-ai-git-cc-remis-projects-738a757c.vercel.app"],

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: UserTable, session: SessionTable, account: AccountTable, verification: VerificationTable },
  }),
  appName: "total-recall-ai",
  plugins: [adminPlugin({ ac, roles: { user, admin, demo } }), nextCookies()],

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

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
