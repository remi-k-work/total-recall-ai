// other libraries
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

// drizzle and db access
import { db } from "@/drizzle/db";

// all table definitions (their schemas)
import { UserTable, SessionTable, AccountTable, VerificationTable } from "@/drizzle/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: UserTable, session: SessionTable, account: AccountTable, verification: VerificationTable },
  }),
  appName: "total-recall-ai",
  plugins: [nextCookies()],

  emailAndPassword: {
    enabled: true,
  },
});
