// services, features, and other libraries
import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "@/services/uploadthing/uploadRouter";

export const { GET, POST } = createRouteHandler({ router: uploadRouter });
