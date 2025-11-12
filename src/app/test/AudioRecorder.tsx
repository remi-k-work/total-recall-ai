"use client";

// react
import { useRef, useState } from "react";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
      handleRecordingCompleted(audioBlob);
      stream.getTracks().forEach((track) => track.stop());
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

  const handleRecordingCompleted = async (audioBlob: Blob) => {
    setIsUploading(true);
    // Upload the audio blob to the server
    const formData = new FormData();
    formData.append("recording", audioBlob, "recording.webm");
    await fetch("/api/notes/recording", { method: "POST", body: formData });
    setIsUploading(false);
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>{isRecording ? "Stop Recording" : "Start Recording"}</button>
      {isRecording && <p>Recording for {recordingTime} seconds</p>}
      {isUploading && <p>Uploading...</p>}
    </div>
  );
}
