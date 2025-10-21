// services, features, and other libraries
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// constants
import { EXPAND_QUERY_PROMPT } from "@/features/notes-assistant/constants/messages";

// Expand the user's question into a hypothetical answer
export async function expandQueryWithHypotheticalAnswer(question: string): Promise<string> {
  try {
    const { text } = await generateText({ model: google("gemini-2.5-flash"), prompt: EXPAND_QUERY_PROMPT(question), temperature: 0 });
    console.log("Expanded query:", text);
    return text;
  } catch (error) {
    console.error("Error expanding query:", error);
    // Fallback to the original question if expansion fails
    return question;
  }
}
