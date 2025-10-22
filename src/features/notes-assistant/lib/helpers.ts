// services, features, and other libraries
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// constants
import { EXPAND_QUERY_PROMPT } from "@/features/notes-assistant/constants/messages";

// Expand the user's question into a hypothetical answer
export async function expandQueryWithHypotheticalAnswer(question: string): Promise<string> {
  try {
    // You are searching for "answers" using an "ideal answer" instead of searching for "answers" using a "question"
    const { text } = await generateText({ model: google("gemini-2.5-flash"), prompt: EXPAND_QUERY_PROMPT(question), temperature: 0 });

    // By generating a hypothetical answer, you create an embedding that is semantically much closer to the specific note chunk you are seeking
    console.log("Expanded query:", text);
    return text;
  } catch (error) {
    console.error("Error expanding query:", error);
    // Fallback to the original question if expansion fails
    return question;
  }
}
