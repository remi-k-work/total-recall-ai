// Load environment variables
import "dotenv/config";

// drizzle and db access
import { dropAllNotes, insertNote, insertNoteChunks } from "@/features/notes/db";

// services, features, and other libraries
import { generateNoteEmbeddings } from "@/features/notes/lib/embeddings2";

// constants
import { EXAMPLE_NOTES } from "./constants/notes";

async function main() {
  try {
    // Perform database seeding or other tasks
    console.log("Seeding notes and chunks...");

    // Drop all notes for a user
    await dropAllNotes("yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP");

    for (const { title, content } of EXAMPLE_NOTES) {
      // Insert a new note for a user
      const [{ id: noteId }] = await insertNote("yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP", { title, content });

      // Generate embeddings for a note
      const noteEmbeddings = await generateNoteEmbeddings(content);

      // Insert multiple new note chunks for a note and the current user
      await insertNoteChunks("yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP", noteId, noteEmbeddings);

      const wordCount = content.split(/\s+/).length;
      console.log(`"${title}" → ${wordCount} words`);
      console.log(`Chunks generated: ${noteEmbeddings.length}`);
    }

    console.log("Seeding complete ✅");
    process.exit(0);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

// Execute the main function
main();
