// Load environment variables
import "dotenv/config";

// drizzle and db access
import { searchNoteChunksForUser } from "@/features/notes/db";

// services, features, and other libraries
import { expandQueryWithHypotheticalAnswer } from "@/features/notes-assistant/lib/helpers";

// constants
import { EXAMPLE_QUESTIONS } from "./constants";

async function main() {
  try {
    // 🔍 Retrieval tests
    console.log("Testing retrieval...");

    for (const { question, expect } of EXAMPLE_QUESTIONS) {
      console.log(`Q: ${question}`);

      // Expand the user's question into a hypothetical answer
      const expandedQuery = await expandQueryWithHypotheticalAnswer(question);

      // Search for and retrieve note chunks most relevant to the user's question
      const results = await searchNoteChunksForUser("yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP", expandedQuery);
      if (results.length > 0) {
        // Print top match
        console.log(
          `Top match (expected: ${expect}): Note "${results[0].noteTitle}" → "${results[0].chunk.slice(0, 100)}..." (similarity: ${results[0].similarity.toFixed(3)})`,
        );

        // Print all matches for debugging
        console.log("All matches:");
        for (const result of results) {
          console.log(`Note "${result.noteTitle}" → [${result.similarity.toFixed(3)}] "${result.chunk.slice(0, 80)}..."`);
        }
      } else {
        console.log("No matches found.");
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

// Execute the main function
main();
