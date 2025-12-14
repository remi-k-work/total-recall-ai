// Load environment variables
import "dotenv/config";

// drizzle and db access
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { insertNote, insertNoteChunks, syncMyNoteTags, syncNoteTags } from "@/features/notes/db";

// all table definitions (their schemas)
import { UserTable } from "@/drizzle/schema";

// services, features, and other libraries
import { auth } from "@/services/better-auth/auth";
import { generateNoteEmbeddings } from "@/features/notes/lib/embeddings2";

// constants
import { DEMO_USER_EMAIL, DEMO_USER_NAME, DEMO_USER_PASS, EXAMPLE_NOTES, MY_NOTE_TAGS } from "./constants";

async function main() {
  try {
    // Perform database seeding or other tasks
    console.log("Creating demo user...");

    // Drop the demo user and their notes
    await db.delete(UserTable).where(eq(UserTable.email, DEMO_USER_EMAIL));

    const {
      user: { id: userId },
    } = await auth.api.createUser({
      body: {
        email: DEMO_USER_EMAIL,
        password: DEMO_USER_PASS,
        name: DEMO_USER_NAME,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: "demo" as any,
      },
    });

    // const userId = "HePVdeWqffbAUg4VPYM1DMCjIeghprhj";

    console.log("Seeding available note tags...");

    // Synchronize all incoming note tags with the existing ones for this user
    await syncMyNoteTags(userId, MY_NOTE_TAGS);

    console.log("Seeding notes and chunks...");

    for (const { title, noteTagIds, content } of EXAMPLE_NOTES) {
      // Insert a new note for a user
      const [{ id: noteId }] = await insertNote(userId, { title, content });

      // Sync tags for a note (useful when the UI sends a full list of tags)
      await syncNoteTags(noteId, noteTagIds);

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
