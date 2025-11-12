// components
import PageHeader from "@/components/PageHeader";
import AudioRecorder from "./AudioRecorder";

export default function Page() {
  return (
    <>
      <PageHeader title="Home" description="Welcome to Total Recall AI!" />
      <AudioRecorder />
    </>
  );
}
