// services, features, and other libraries
import { Effect } from "effect";
import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { AiSdkError } from "@/lib/errors";

// Initialize our embedding model
const model = google.embedding("gemini-embedding-001");

// A single, structure-aware splitter for all notes
const markdownSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", { chunkSize: 1000, chunkOverlap: 200 });

// Parse note content into smaller chunks for similarity search and retrieval
const generateNoteChunks = (noteContent: string) => Effect.promise(() => markdownSplitter.splitText(noteContent));

// Embed many values at once (batch embedding); in other words, create embeddings for all note chunks
const embedManyNoteChunks = (noteChunks: string[]) =>
  Effect.tryPromise({
    try: () => embedMany({ model, values: noteChunks, providerOptions: { google: { taskType: "RETRIEVAL_DOCUMENT", outputDimensionality: 1536 } } }),
    catch: (cause) => new AiSdkError({ message: "Failed to embed note chunks", cause }),
  });

// Create an embedding for a single value, in this case the user's question
const embedQuestion = (question: string) =>
  Effect.tryPromise({
    try: () => embed({ model, value: question, providerOptions: { google: { taskType: "QUESTION_ANSWERING", outputDimensionality: 1536 } } }),
    catch: (cause) => new AiSdkError({ message: "Failed to embed question", cause }),
  });

// Generate embeddings for a note
export const generateNoteEmbeddings = (noteContent: string) =>
  Effect.gen(function* () {
    // Parse note content into smaller chunks for similarity search and retrieval
    const noteChunks = yield* generateNoteChunks(noteContent);

    // Embed many values at once (batch embedding); in other words, create embeddings for all note chunks
    const { embeddings } = yield* embedManyNoteChunks(noteChunks);

    // Return note chunks and their corresponding embeddings following the same naming convention as our "note_chunk" database table
    return embeddings.map((embedding, index) => ({ chunk: noteChunks[index], embedding }));
  });

// Create an embedding vector for the user's question
export const generateQuestionEmbedding = (question: string) =>
  Effect.gen(function* () {
    // Create an embedding for a single value, in this case the user's question
    const { embedding } = yield* embedQuestion(question);

    // Return the embedding
    return embedding;
  });
