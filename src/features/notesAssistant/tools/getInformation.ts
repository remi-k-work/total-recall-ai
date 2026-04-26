// drizzle and db access
import { getInformation } from "@/features/notesAssistant/db";

// services, features, and other libraries
import { tool } from "ai";
import { InputSchema, OutputSchema } from "@/features/notesAssistant/schemas";
import { RuntimeServer } from "@/lib/RuntimeServer";

export const getInformationTool = (userId: string) =>
  tool({
    description: "Searches the user's personal notes to find chunks of text that are semantically relevant to their question.",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    execute: async ({ question }) => {
      // Search the agent's knowledge base for document chunks that are most relevant to the user's question
      return await RuntimeServer.runPromise(getInformation(userId, question));
    },
  });
