"use client";

// react
import { useRef, useState, useTransition } from "react";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// types
interface ProcessRecordingActionResult {
  actionStatus: "idle" | "succeeded" | "failed";
}
export type ProcessRecordingAction = (formData: FormData, recordingFieldName: string) => Promise<ProcessRecordingActionResult>;

interface AudioRecorderProps {
  recordingFieldName: string;
  processRecordingAction: ProcessRecordingAction;
}

export default function AudioRecorder({ recordingFieldName, processRecordingAction }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, startProcessing] = useTransition();
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder>(undefined);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>(undefined);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 } });

    // Try to use the webm format, which is widely supported and has a low file size compared to mp4
    const options = { mimeType: 'audio/webm;codecs="opus"' };
    let mediaRecorder: MediaRecorder;

    if (MediaRecorder.isTypeSupported(options.mimeType)) {
      mediaRecorder = new MediaRecorder(stream, options);
    } else {
      // Fallback to the default format
      mediaRecorder = new MediaRecorder(stream);
    }

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = ({ data }) => {
      if (data.size > 0) chunksRef.current.push(data);
    };

    mediaRecorder.onstop = () => {
      const mimeType = mediaRecorder.mimeType ?? "audio/webm";
      const audioBlob = new Blob(chunksRef.current, { type: mimeType });
      stream.getTracks().forEach((track) => track.stop());

      // Upload the audio blob to the server and process it
      const formData = new FormData();
      formData.append(recordingFieldName, audioBlob);
      startProcessing(async () => {
        await processRecordingAction(formData, recordingFieldName);
      });
    };

    // Start recording, and collect data every second
    mediaRecorder.start(1000);
    setIsRecording(true);
    setRecordingTime(0);

    // Start the timer
    timerRef.current = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  return (
    <div>
      <Button type="button" disabled={isProcessing} onClick={isRecording ? stopRecording : startRecording}>
        {isProcessing ? <Loader2 className="size-9 animate-spin" /> : <MicrophoneIcon className="size-9" />}
        {isProcessing ? "Processing..." : isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {isRecording && <p>Recording for {recordingTime} seconds</p>}
    </div>
  );
}
