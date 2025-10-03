// Load environment variables
import "dotenv/config";

// drizzle and db access
import { searchNoteChunksForUser } from "@/features/notes/db";

// constants
import { EXAMPLE_QUESTIONS } from "./constants/questions";

async function main() {
  try {
    // 🔍 Retrieval tests
    console.log("Testing retrieval...");

    for (const { question, expect } of EXAMPLE_QUESTIONS) {
      const results = await searchNoteChunksForUser("yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP", question);
      console.log(`Q: ${question}`);
      if (results.length > 0) {
        // Print top match
        console.log(`Top match (expected: ${expect}): "${results[0].chunk.slice(0, 100)}..." (similarity: ${results[0].similarity.toFixed(3)})`);

        // Print all matches for debugging
        console.log("All matches:");
        for (const result of results) {
          console.log(`→ [${result.similarity.toFixed(3)}] "${result.chunk.slice(0, 80)}..."`);
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
