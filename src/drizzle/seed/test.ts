// Load environment variables
import "dotenv/config";

// drizzle and db access
import { insertNote, insertNoteChunks } from "@/features/notes/db";

// services, features, and other libraries
import { generateNoteEmbeddings } from "@/features/notes/lib/embeddings";

async function main() {
  try {
    // Perform database seeding or other tasks
    console.log("Seeding database...");

    const [{ id }] = await insertNote("yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP", { title: "Test Note", content: "This is a test note." });
    const noteEmbeddings = await generateNoteEmbeddings("This is a test note.\n\nThis is another test note.");

    await insertNoteChunks(id, noteEmbeddings);
    process.exit(0);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

// Execute the main function
main();
