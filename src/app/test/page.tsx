// "use client";

// react
import { Suspense } from "react";

// next
import { connection } from "next/server";

// server actions and mutations
// import transcribeNote from "@/features/notes/actions/transcribeNote3";

// drizzle and db access
import { DB } from "@/drizzle/dbEffect2";
import { insertNote, insertNoteChunks, Note } from "@/features/notes/db";

// services, features, and other libraries
import { Effect } from "effect";
import { RuntimeServer } from "@/lib/RuntimeServer";
import { generateNoteEmbeddings } from "@/features/notes/lib/embeddings2";

// components
import PageHeader from "@/components/PageHeader";
// import AudioRecorder from "@/components/AudioRecorder";

// Page remains the fast, static shell
export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}

async function PageContent() {
  // Explicitly defer to request time (Effect uses Date.now() internally)
  await connection();

  // Generate embeddings for a note first; it is an external api call that may throw and is time-consuming (no db lock held)
  const noteEmbeddings = await generateNoteEmbeddings("This is a test note.");

  const effect = Effect.gen(function* () {
    const db = yield* DB;
    const note = yield* Note;

    // Run all db operations in a transaction
    return yield* db.transaction(
      Effect.gen(function* () {
        // Insert a new note for a user
        yield* note.insertNote("0mTO29SmxqMTpuH0Gaf6uI8TQv3zxCUb", { title: "Test Note", content: "This is a test note." });

        // 3. FORCE ROLLBACK: This returns a failing Effect
        // The transaction helper catches this failure and tells Drizzle to rollback
        return yield* Effect.fail(1);
      }),
    );
  });

  await RuntimeServer.runPromise(effect);

  return (
    <>
      <PageHeader title="Home" description="Welcome to Total Recall AI!" />
      {/* <AudioRecorder
        recordingFieldName="recording"
        processRecordingAction={transcribeNote}
        onRecordingProcessed={(result) => console.log(result)}
        startRecordingText="Start Transcribing"
        stopRecordingText="Stop Transcribing"
        otherFields={{ isNewNote: "true" }}
      />
      <AudioRecorder
        recordingFieldName="recording"
        processRecordingAction={transcribeNote}
        onRecordingProcessed={(result) => console.log(result)}
        startRecordingText="Start Transcribing"
        stopRecordingText="Stop Transcribing"
      /> */}
    </>
  );
}
