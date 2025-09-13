// other libraries
import { z } from "zod";

export const EmailSchema = z.email("The email address you gave appears to be incorrect; please update it");
