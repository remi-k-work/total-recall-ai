// next
import { NextResponse } from "next/server";

// node.js
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";

// types
import type { NextRequest } from "next/server";

export async function POST(_req: NextRequest, ctx: RouteContext<"/api/notes/recording">) {
  const formData = await _req.formData();
  const recordingFile = formData.get("recording") as File;

  // Create a unique identifier for the recording audio file
  const recordingId = `note-recording-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Normally, we would upload the audio file to the server's storage
  const bytes = await recordingFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create the "uploads" directory in case it does not exist yet
  const uploadsDir = join(process.cwd(), "uploads");
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch {}

  // Save the recording audio file to the "uploads" directory
  const fileName = `${recordingId}.webm`;
  const filePath = join(uploadsDir, fileName);
  await writeFile(filePath, buffer);

  return NextResponse.json({ success: true, recordingId });
}
