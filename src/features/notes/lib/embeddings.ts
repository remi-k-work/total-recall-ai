// services, features, and other libraries
import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";
import { TokenTextSplitter } from "@langchain/textsplitters";

// Initialize our embedding model
const model = google.embedding("gemini-embedding-001");

// Very short notes (to-dos, quick reminders) (<100 words, ~50–70 tokens, ~20% overlap)
const noteSplitterS = new TokenTextSplitter({ chunkSize: 100, chunkOverlap: 20 });

// Medium-length notes (paragraphs, daily logs) (~100–400 words, ~150–250 tokens, ~20% overlap)
const noteSplitterM = new TokenTextSplitter({ chunkSize: 200, chunkOverlap: 40 });

// Long notes, essays, study guides (>400 words, ~350–800 tokens, ~20% overlap)
const noteSplitterL = new TokenTextSplitter({ chunkSize: 500, chunkOverlap: 100 });

// Parse note's content into smaller chunks for similarity search and retrieval
const generateNoteChunks = (noteContent: string) => {
  // Use different text splitters depending on the length of the note
  const wordCount = noteContent.trim().split(/\s+/).length;

  return wordCount < 100 ? noteSplitterS.splitText(noteContent) : wordCount < 400 ? noteSplitterM.splitText(noteContent) : noteSplitterL.splitText(noteContent);
};

// Generate embeddings for a note
export async function generateNoteEmbeddings(noteContent: string): Promise<Array<{ chunk: string; embedding: number[] }>> {
  // Parse note's content into smaller chunks for similarity search and retrieval
  const noteChunks = await generateNoteChunks(noteContent);

  // Embed many values at once (batch embedding); in other words, create embeddings for all note chunks
  const { embeddings } = await embedMany({ model, values: noteChunks, providerOptions: { google: { outputDimensionality: 768 } } });

  // Return note chunks and their corresponding embeddings following the same naming convention as our "note_chunk" database table
  return embeddings.map((embedding, index) => ({ chunk: noteChunks[index], embedding }));
}

// Create an embedding vector for the user's question
export async function generateQuestionEmbedding(question: string): Promise<number[]> {
  // Create an embedding for a single value, in this case the user's question
  const { embedding } = await embed({ model, value: question, providerOptions: { google: { outputDimensionality: 768 } } });

  // Return the embedding
  return embedding;
}
