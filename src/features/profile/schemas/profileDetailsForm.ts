// services, features, and other libraries
import { z } from "zod";

export const ProfileDetailsFormSchema = z.object({
  name: z.string().trim().min(1, "Please provide your name; this is a necessary field").max(25, "Please keep the name to a maximum of 25 characters"),
});
