"use client";

// server actions and mutations
import transcribeNote from "@/features/notes/actions/transcribeNote3";

// components
import PageHeader from "@/components/PageHeader";
import AudioRecorder from "@/components/AudioRecorder";

export default function Page() {
  return (
    <>
      <PageHeader title="Home" description="Welcome to Total Recall AI!" />
      <AudioRecorder
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
      />
    </>
  );
}
