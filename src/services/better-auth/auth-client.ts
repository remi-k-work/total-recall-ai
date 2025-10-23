// services, features, and other libraries
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, demo, user } from "./permissions";
import { inferAdditionalFields } from "better-auth/client/plugins";

// types
import type { auth } from "./auth.js";

export const authClient = createAuthClient({ plugins: [adminClient({ ac, roles: { user, admin, demo } }), inferAdditionalFields<typeof auth>()] });
