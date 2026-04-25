"use client";

// react
import { useCallback, useRef } from "react";

// server actions and mutations
import { transcribeNote } from "@/features/notes/actions/transcribeNote3";

// services, features, and other libraries
import { Effect, Option } from "effect";
import { useAtomSet, useAtomValue } from "@effect-atom/atom-react";
import { FormReact } from "@lucas-barake/effect-form-react";
import { RpcNotesClient } from "@/features/notes/rpc/client";
import { newNoteFormBuilder } from "@/features/notes/schemas";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";

// components
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { MarkdownInput, TextInput } from "@/components/Form/Inputs";
import { FormSubmit, SubmitStatus } from "@/components/Form";
import AudioRecorder from "@/components/AudioRecorder";

// assets
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

// types
import type { MDXEditorMethods } from "@mdxeditor/editor";

interface NewNoteFormProps {
  inNoteModal?: boolean;
}

const newNoteForm = FormReact.make(newNoteFormBuilder, {
  runtime: RuntimeAtom,
  fields: { title: TextInput, content: MarkdownInput },
  onSubmit: (_, { decoded: { title, content } }) =>
    Effect.gen(function* () {
      const { newNoteForm } = yield* RpcNotesClient;
      yield* newNoteForm({ title, content });
    }),
});

const titleAtoms = newNoteForm.getFieldAtoms(newNoteForm.fields.title);

export default function NewNoteForm({ inNoteModal = false }: NewNoteFormProps) {
  // Get the form context
  const submit = useAtomSet(newNoteForm.submit);
  const titleOption = useAtomValue(titleAtoms.value);
  const setTitle = useAtomSet(titleAtoms.setValue);

  // Provide feedback to the user regarding this form actions
  useSubmitToast(newNoteForm.submit, "[NEW NOTE]", "The new note has been created.", undefined, "/notes", true);

  // Create a ref to the editor component
  const editorRef = useRef<MDXEditorMethods>(null);

  // Function to be called when the transcription is processed
  const handleRecordingProcessed = useCallback(
    ({ actionStatus, result }: Awaited<ReturnType<typeof transcribeNote>>) => {
      // Only update the form if the transcription was successful
      if (actionStatus !== "succeeded" || !result) return;

      // Extract the title and content from the result
      const { title, content } = result;

      // Only update the note title if it has not been established yet
      const currTitle = Option.match(titleOption, { onNone: () => "", onSome: (title) => title });
      if (!currTitle) setTitle(title ?? "");

      // Insert the transcribed content into the markdown field at the cursor's location
      editorRef.current?.focus();
      editorRef.current?.insertMarkdown(content);
    },
    [titleOption, setTitle]
  );

  return (
    <Card className="max-w-4xl">
      {!inNoteModal ? (
        <CardHeader>
          <CardTitle>New Note</CardTitle>
          <CardDescription>To create a new note</CardDescription>
          <CardAction>
            <AudioRecorder
              recordingFieldName="recording"
              processRecordingAction={transcribeNote}
              onRecordingProcessed={handleRecordingProcessed}
              startRecordingText="Start Transcribing"
              stopRecordingText="Stop Transcribing"
              otherFields={{ isNewNote: "true" }}
            />
          </CardAction>
        </CardHeader>
      ) : (
        <CardHeader>
          <CardAction>
            <AudioRecorder
              recordingFieldName="recording"
              processRecordingAction={transcribeNote}
              onRecordingProcessed={handleRecordingProcessed}
              startRecordingText="Start Transcribing"
              stopRecordingText="Stop Transcribing"
              otherFields={{ isNewNote: "true" }}
            />
          </CardAction>
        </CardHeader>
      )}
      <CardContent>
        <newNoteForm.Initialize defaultValues={{ title: "", content: "" }}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
            }}
          >
            <newNoteForm.title label="Title" size={40} maxLength={51} spellCheck autoComplete="off" placeholder="e.g., Quick Reminder" />
            <br />
            <newNoteForm.content
              ref={editorRef}
              label="Content"
              spellCheck={false}
              placeholder="e.g., Buy cat food. Call mom. Pay electricity bill. Remember to bring umbrella tomorrow in case it rains."
            />
            <br />
            <SubmitStatus form={newNoteForm} formName="[NEW NOTE]" succeededDesc="The new note has been created." />
            <FormSubmit form={newNoteForm} submitIcon={<DocumentPlusIcon className="size-9" />} submitText="Create New Note" />
          </form>
        </newNoteForm.Initialize>
      </CardContent>
    </Card>
  );
}
