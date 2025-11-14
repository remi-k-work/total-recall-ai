"use client";

// react
import { useCallback, useEffect, useEffectEvent, useRef, useState, useTransition } from "react";

// components
import { Button } from "@/components/ui/custom/button";
import ErrorLine from "./form/field-errors/ErrorLine";

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

// constants
const MEDIA_RECORDER_OPTIONS = { mimeType: 'audio/webm;codecs="opus"' } as const;
const MEDIA_STREAM_CONSTRAINTS = { audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000, channelCount: 1 } } as const;
const MAX_RECORD_SECONDS = 60;

export default function AudioRecorder({ recordingFieldName, processRecordingAction }: AudioRecorderProps) {
  // The UI state
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, startProcessing] = useTransition();
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refs for browser APIs and timers
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const streamRef = useRef<MediaStream>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>(null);

  // Function to be called when the recording time limit is reached
  const onRecordingLimitReached = useEffectEvent(() => {
    stopRecording();
  });

  useEffect(() => {
    // Stop recording if the time limit is reached
    if (recordingTime >= MAX_RECORD_SECONDS) onRecordingLimitReached();
  }, [recordingTime]);

  useEffect(() => {
    // This is critical to prevent memory leaks
    return () => {
      cleanUpResources();
    };
  }, []);

  // This is the primary cleanup function
  const cleanUpResources = useCallback(() => {
    // Remove any event handlers before stopping
    mediaRecorderRef.current?.removeEventListener("dataavailable", handleDataAvailable);
    mediaRecorderRef.current?.removeEventListener("stop", handleStop);

    // Stop all media tracks
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    // Stop the media recorder in case it is still running
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    mediaRecorderRef.current = null;

    // Clear the interval timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    // Reset audio chunks
    chunksRef.current = [];
  }, []);

  // This function only stops the recorder (the onstop event handler will take care of the rest)
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
  }, []);

  // Event handler for MediaRecorder's 'dataavailable' event; fired when a chunk of audio data is ready
  const handleDataAvailable = useCallback(({ data }: BlobEvent) => {
    if (data.size > 0) chunksRef.current.push(data);
  }, []);

  // Event handler for MediaRecorder's 'stop' event; fired when recording stops (manually or via time limit)
  const handleStop = useCallback(() => {
    const mimeType = mediaRecorderRef.current?.mimeType ?? "audio/webm";
    const audioBlob = new Blob(chunksRef.current, { type: mimeType });

    // Cleanup resources after blob is created
    cleanUpResources();

    // Reset UI state
    setIsRecording(false);
    setRecordingTime(0);

    // Upload the audio blob to the server and process it
    const formData = new FormData();
    formData.append(recordingFieldName, audioBlob);
    startProcessing(async () => {
      const result = await processRecordingAction(formData, recordingFieldName);
      if (result.actionStatus === "failed") setError("Processing failed. Please try again.");
    });
  }, [cleanUpResources, processRecordingAction, recordingFieldName, startProcessing]);

  // Asks for microphone permission and starts the recording process
  const startRecording = useCallback(async () => {
    // Clear any previous errors and resources
    setError(null);
    cleanUpResources();

    try {
      // Obtain the user's media stream and the required permissions
      streamRef.current = await navigator.mediaDevices.getUserMedia(MEDIA_STREAM_CONSTRAINTS);

      // Create MediaRecorder instance
      if (MediaRecorder.isTypeSupported(MEDIA_RECORDER_OPTIONS.mimeType)) {
        mediaRecorderRef.current = new MediaRecorder(streamRef.current, MEDIA_RECORDER_OPTIONS);
      } else {
        // Fallback to default if preferred MIME type is not supported
        mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      }

      // Set up event handlers
      mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.addEventListener("stop", handleStop);

      // Start recording, and collecting data every second
      mediaRecorderRef.current.start(1000);

      // Update the UI state once all processes have started successfully
      setIsRecording(true);

      // Start recording timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      if (error instanceof Error) {
        switch (error.name) {
          case "NotAllowedError":
            setError("Microphone permission denied. Please allow access.");
            break;
          case "NotFoundError":
            setError("No microphone found.");
            break;
          case "NotReadableError":
            setError("Microphone is in use by another application.");
            break;

          default:
            setError("Could not start recording. Please try again.");
        }
      } else setError("Could not start recording. Please try again.");

      // Ensure cleanup on failure as well
      cleanUpResources();
      setIsRecording(false);
    }
  }, [cleanUpResources, handleDataAvailable, handleStop]);

  return (
    <section className="grid gap-1">
      <Button type="button" variant={isRecording ? "destructive" : "default"} disabled={isProcessing} onClick={isRecording ? stopRecording : startRecording}>
        {isProcessing ? <Loader2 className="size-9 animate-spin" /> : <MicrophoneIcon className="size-9" />}
        {isProcessing ? "Processing..." : isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {isRecording && (
        <footer className="grid">
          <div className="bg-muted col-span-full row-span-full overflow-clip">
            <div
              className="from-primary to-destructive h-full bg-linear-to-r transition-all duration-1000 ease-linear"
              style={{ width: `${(recordingTime / MAX_RECORD_SECONDS) * 100}%` }}
            />
          </div>
          <p className="col-span-full row-span-full max-w-none p-3 text-center slashed-zero tabular-nums">
            Recording for {recordingTime}/{MAX_RECORD_SECONDS} seconds
          </p>
        </footer>
      )}
      {error && <ErrorLine message={error} />}
    </section>
  );
}
