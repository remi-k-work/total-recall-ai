// services, features, and other libraries
import { Effect } from "effect";
import { convertToModelMessages } from "ai";
import { RuntimeServer } from "@/lib/RuntimeServer";
import { runNotesAssistant } from "@/features/notesAssistant/lib/agent";

// types
import type { ModelMessage } from "ai";
import type { NotesAssistantUIMessage } from "@/features/notesAssistant/lib/agent";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

const main = (modelMessages: ModelMessage[]) =>
  Effect.gen(function* () {
    // Run the notes assistant using a fallback chain of models
    const { response } = yield* runNotesAssistant(modelMessages);
    return response;
  }).pipe(
    Effect.scoped,
    Effect.catchAll((error) => Effect.logError(`[NOTES ASSISTANT] recovering from ${error._tag}`))
  );

export async function POST(req: Request) {
  const { messages }: { messages: NotesAssistantUIMessage[] } = await req.json();
  const modelMessages = await convertToModelMessages(messages);

  return await RuntimeServer.runPromise(main(modelMessages));
}
