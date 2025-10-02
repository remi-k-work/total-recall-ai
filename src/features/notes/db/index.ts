// drizzle and db access
import { db } from "@/drizzle/db";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";

// all table definitions (their schemas)
import { NoteChunkTable, NoteTable } from "@/drizzle/schema";

// services, features, and other libraries
import { generateQuestionEmbedding } from "@/features/notes/lib/embeddings";

// Insert a new note for a user
export const insertNote = (userId: string, data: Omit<typeof NoteTable.$inferInsert, "userId">) =>
  db
    .insert(NoteTable)
    .values({ userId, ...data })
    .returning({ id: NoteTable.id });

// Update a note for a user
export const updateNote = (id: string, data: Partial<Omit<typeof NoteTable.$inferInsert, "id">>) => db.update(NoteTable).set(data).where(eq(NoteTable.id, id));

// Delete a note for a user
export const deleteNote = (id: string) => db.delete(NoteTable).where(eq(NoteTable.id, id));

// Insert a single new note chunk for a note
export const insertNoteChunk = (noteId: string, data: Omit<typeof NoteChunkTable.$inferInsert, "noteId">) =>
  db.insert(NoteChunkTable).values({ noteId, ...data });

// Insert multiple new note chunks for a note
export const insertNoteChunks = (noteId: string, data: Omit<typeof NoteChunkTable.$inferInsert, "noteId">[]) =>
  db.insert(NoteChunkTable).values(data.map((item) => ({ noteId, ...item })));

// Search for and retrieve note chunks most relevant to the user's question
export const searchNoteChunksForUser = async (userId: string, question: string, topK: number = 5, minSimilarity: number = 0.5) => {
  // Create an embedding vector for the user's question
  const questionEmbedding = await generateQuestionEmbedding(question);

  // Define the similarity calculation using drizzle's helper
  const similarity = sql<number>`1 - (${cosineDistance(NoteChunkTable.embedding, questionEmbedding)})`;

  // Query the database for relevant chunks, ensuring we only search notes owned by the specified user
  const relevantChunks = await db
    .select({
      id: NoteChunkTable.id,
      noteId: NoteChunkTable.noteId,
      chunk: NoteChunkTable.chunk,
      // Return the calculated similarity score
      similarity,
    })
    .from(NoteChunkTable)
    // Join with the notes table to filter by the owner
    .innerJoin(NoteTable, eq(NoteChunkTable.noteId, NoteTable.id))
    .where(
      and(
        // Ensure we only get notes for the current user
        eq(NoteTable.userId, userId),
        // Filter out results that are not very similar
        gt(similarity, minSimilarity),
      ),
    )
    // Order the results by the best match first
    .orderBy(desc(similarity))
    // Limit to the top K results
    .limit(topK);

  return relevantChunks;
};
