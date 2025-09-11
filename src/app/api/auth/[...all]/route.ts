// services
import { auth } from "@/services/better-auth/auth";

// other libraries
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
