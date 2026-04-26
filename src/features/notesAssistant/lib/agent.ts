// node.js
import { inspect } from "node:util";

// services, features, and other libraries
import { Effect, Schedule } from "effect";
import { generateText, InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai";
import { google } from "@ai-sdk/google";
import { getInformationTool } from "@/features/notesAssistant/tools/getInformation";
import { Auth } from "@/features/auth/lib/auth";
import { AiSdkError } from "@/lib/errors";

// types
import type { LanguageModel, ModelMessage } from "ai";
export type NotesAssistantUIMessage = InferAgentUIMessage<typeof notesAssistant>;

// constants
import { INSTRUCTIONS } from "@/features/notesAssistant/constants";

const PREFLIGHT_TIMEOUT = "3 seconds";
const MODEL_TIMEOUT = "15 seconds";
const STREAM_RETRY = Schedule.intersect(Schedule.exponential("500 millis"), Schedule.recurs(2)).pipe(Schedule.jittered);

const MODEL_CANDIDATES = [
  { name: "gemini-3.1-pro", model: google("gemini-3.1-pro-preview") },
  { name: "gemini-2.5-pro", model: google("gemini-2.5-pro") },
  { name: "gemini-2.5-flash", model: google("gemini-2.5-flash") },
  { name: "gemini-2.5-flash-lite", model: google("gemini-2.5-flash-lite") },
] as const;

// This is a factory designed to create a notes assistant that uses a specified model
const notesAssistant = (userId: string, model: LanguageModel) =>
  new ToolLoopAgent({
    model,
    instructions: INSTRUCTIONS,

    stopWhen: stepCountIs(5),
    maxRetries: 2,

    tools: {
      getInformation: getInformationTool(userId),
    },

    prepareStep: async ({ messages }) => {
      // Only retain recent messages to remain within context limits (system instructions + the last 10 messages)
      if (messages.length > 20) return { messages: [messages[0], ...messages.slice(-10)] };
      return {};
    },

    // Give us some feedback on each step for debugging
    onStepFinish: async ({ usage, finishReason, toolCalls, toolResults }) => {
      console.log(
        "Step completed:",
        inspect(
          {
            tokens: {
              in: usage.inputTokens,
              out: usage.outputTokens,
            },
            finishReason,
            toolCalls: toolCalls?.map(({ toolName, input }) => ({
              toolName,
              input,
            })),
            toolResults: toolResults?.map(({ toolName, input, output }) => ({
              toolName,
              input,
              output,
            })),
          },
          { depth: null, colors: true }
        )
      );
    },
  });

// Run the notes assistant using a specified model and prompt, and start streaming its responses
const runNotesAssistantWithModel = (userId: string, name: string, model: LanguageModel, prompt: string | ModelMessage[]) =>
  Effect.gen(function* () {
    // First, perform the pre-flight check; if this check fails, the model attempt will also fail, activating the fallback chain
    yield* Effect.tryPromise({
      try: () => generateText({ model, prompt: "OK", maxOutputTokens: 1, maxRetries: 0 }),
      catch: (cause) => new AiSdkError({ message: `Pre-flight failed for ${name}`, cause }),
    }).pipe(
      Effect.timeoutFail({
        duration: PREFLIGHT_TIMEOUT,
        onTimeout: () => new AiSdkError({ message: `Pre-flight timeout for ${name}` }),
      }),
      Effect.asVoid
    );

    // If we reach this point, the model is responsive; proceed to initialize the real agent
    const result = yield* Effect.tryPromise({
      try: () => notesAssistant(userId, model).stream({ prompt }),
      catch: (cause) => new AiSdkError({ message: "Failed to init support agent stream", cause }),
    });

    // Convert to response immediately so we can check the underlying stream
    const response = yield* Effect.try({
      try: () => result.toUIMessageStreamResponse(),
      catch: (cause) => new AiSdkError({ message: "Failed to generate stream response", cause }),
    });

    return { result, response };
  });

// The resilience policy ensures the notes assistant operates using multiple models in a fallback chain (model1 -> model2 -> model3 -> model4 -> model5)
const notesAssistantPolicy = (userId: string, prompt: string | ModelMessage[]) =>
  Effect.gen(function* () {
    const attempts = MODEL_CANDIDATES.map(({ name, model }) =>
      runNotesAssistantWithModel(userId, name, model, prompt).pipe(
        // The overall timeout for this model attempt
        Effect.timeoutFail({ duration: MODEL_TIMEOUT, onTimeout: () => new AiSdkError({ message: `Model '${name}' timed out after ${MODEL_TIMEOUT}` }) }),
        // The standard retry mechanism does not require any additional logic; it attempts to retry 2 times before failing to proceed to the next model
        Effect.retry(STREAM_RETRY),
        // Log a warning if the model completely fails all retries before moving to the next candidate
        Effect.tapError((cause) =>
          Effect.logWarning(
            `[NOTES ASSISTANT] Model '${name}' failed. Moving to fallback. Cause: ${cause instanceof Error ? cause.message : JSON.stringify(cause, null, 2)}`
          )
        )
      )
    );

    // Run through the mapped attempts array in order
    return yield* Effect.firstSuccessOf(attempts);
  });

// Run the notes assistant using a fallback chain of models
export const runNotesAssistant = (prompt: string | ModelMessage[]) =>
  Effect.gen(function* () {
    // Access the user session data from the server side or fail with an unauthorized access error
    const auth = yield* Auth;
    const {
      user: { id: userId },
    } = yield* auth.getUserSessionData;

    return yield* notesAssistantPolicy(userId, prompt);
  });
