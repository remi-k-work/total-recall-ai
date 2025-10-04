// drizzle and db access
import { db } from "@/drizzle/db";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";

// all table definitions (their schemas)
import { NoteChunkTable } from "@/drizzle/schema";

// services, features, and other libraries
import { generateQuestionEmbedding } from "@/features/notes/lib/embeddings";

// Search for and retrieve note chunks most relevant to the user's question
export const searchNoteChunksForUser = async (userId: string, question: string, topK: number = 5, baseMinSimilarity: number = 0.5) => {
  // Create an embedding vector for the user's question
  const questionEmbedding = await generateQuestionEmbedding(question);

  // Define the similarity calculation using drizzle's helper
  const similarity = sql<number>`1 - (${cosineDistance(NoteChunkTable.embedding, questionEmbedding)})`;

  // Query candidate chunks for this user, ordered by similarity
  const candidateChunks = await db
    .select({ id: NoteChunkTable.id, noteId: NoteChunkTable.noteId, chunk: NoteChunkTable.chunk, similarity })
    .from(NoteChunkTable)
    .where(
      and(
        // Only return chunks owned by the current user
        eq(NoteChunkTable.userId, userId),
        // Apply a hard floor — discard "obviously irrelevant" chunks
        gt(similarity, baseMinSimilarity),
      ),
    )
    .orderBy(desc(similarity))
    .limit(topK);

  if (candidateChunks.length === 0) return [];

  // Adaptive confidence logic
  const top = candidateChunks[0].similarity;
  const second = candidateChunks[1]?.similarity ?? 0;

  // Confidence criteria:
  // - Top result must clear 0.6 (to ensure reasonable semantic match)
  // - AND top must beat second-best by a margin (0.05 = ~5%)
  if (!(top >= 0.6 && (top - second >= 0.05 || second < 0.6))) return [];

  // Return candidate chunks (confident case)
  return candidateChunks;
};
