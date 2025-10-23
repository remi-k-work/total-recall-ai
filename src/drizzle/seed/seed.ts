// Load environment variables
import "dotenv/config";

// drizzle and db access
import { dropDemoUser, insertNote, insertNoteChunks } from "@/features/notes/db";

// services, features, and other libraries
import { auth } from "@/services/better-auth/auth";
import { generateNoteEmbeddings } from "@/features/notes/lib/embeddings2";

// constants
import { EXAMPLE_NOTES } from "./constants/notes";

async function main() {
  try {
    // Perform database seeding or other tasks
    console.log("Creating demo user...");
    await dropDemoUser();

    const {
      user: { id: userId },
    } = await auth.api.createUser({
      body: {
        email: "demo@example.com",
        password: "password!",
        name: "Demo User",
        role: "demo",
      },
    });

    console.log("Seeding notes and chunks...");

    for (const { title, content } of EXAMPLE_NOTES) {
      // Insert a new note for a user
      const [{ id: noteId }] = await insertNote(userId, { title, content });

      // Generate embeddings for a note
      const noteEmbeddings = await generateNoteEmbeddings(content);

      // Insert multiple new note chunks for a note and the current user
      await insertNoteChunks(userId, noteId, noteEmbeddings);

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
