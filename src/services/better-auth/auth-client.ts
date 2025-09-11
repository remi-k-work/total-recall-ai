// other libraries
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// types
import type { auth } from "./auth.js";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});
