// services, features, and other libraries
import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Initialize our embedding model
const model = google.textEmbedding("gemini-embedding-001");

// A single, structure-aware splitter for all notes
const markdownSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", { chunkSize: 1000, chunkOverlap: 200 });

// Parse note's content into smaller chunks for similarity search and retrieval
const generateNoteChunks = (noteContent: string) => markdownSplitter.splitText(noteContent);

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
