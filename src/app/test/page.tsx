// server actions and mutations
import transcribeNote from "@/features/notes/actions/transcribeNote";

// components
import PageHeader from "@/components/PageHeader";
import AudioRecorder from "@/components/AudioRecorder";

export default function Page() {
  return (
    <>
      <PageHeader title="Home" description="Welcome to Total Recall AI!" />
      <AudioRecorder recordingFieldName="recording" processRecordingAction={transcribeNote} />
    </>
  );
}
