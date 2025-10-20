// services, features, and other libraries
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// Expand the user's question into a hypothetical answer
export async function expandQueryWithHypotheticalAnswer(question: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `You are a query optimization assistant. Your task is to generate a short, hypothetical paragraph that represents an ideal note answering the user's question. This paragraph will be used for a semantic search.
      
      User's Question: "${question}"
      
      Hypothetical Note Paragraph:`,
      temperature: 0,
    });
    console.log("Expanded query:", text);
    return text;
  } catch (error) {
    console.error("Error expanding query:", error);
    // Fallback to the original question if expansion fails
    return question;
  }
}
