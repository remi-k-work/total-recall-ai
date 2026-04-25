"use client";

// react
import { useCallback, useMemo, useRef } from "react";

// server actions and mutations
import { transcribeNote } from "@/features/notes/actions/transcribeNote3";

// services, features, and other libraries
import { Effect } from "effect";
import { useAtomSet } from "@effect-atom/atom-react";
import { FormReact } from "@lucas-barake/effect-form-react";
import { RpcNotesClient } from "@/features/notes/rpc/client";
import { editNoteFormBuilder } from "@/features/notes/schemas";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";

// components
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { MarkdownInput, TextInput } from "@/components/Form/Inputs";
import { FormSubmit, SubmitStatus } from "@/components/Form";
import AudioRecorder from "@/components/AudioRecorder";

// assets
import { DocumentTextIcon } from "@heroicons/react/24/outline";

// types
import type { NoteDetails } from "@/features/notes/db";
import type { MDXEditorMethods } from "@mdxeditor/editor";

interface EditNoteFormProps {
  note: NoteDetails;
  inNoteModal?: boolean;
}

const editNoteForm = (noteId: string) =>
  FormReact.make(editNoteFormBuilder, {
    runtime: RuntimeAtom,
    fields: { title: TextInput, content: MarkdownInput },
    onSubmit: (_, { decoded: { title, content } }) =>
      Effect.gen(function* () {
        const { editNoteForm } = yield* RpcNotesClient;
        yield* editNoteForm({ noteId, title, content });
      }),
  });

export default function EditNoteForm({ note: { id: noteId, title, content }, inNoteModal = false }: EditNoteFormProps) {
  // Get the form context
  const editNoteFormL = useMemo(() => editNoteForm(noteId), [noteId]);
  const submit = useAtomSet(editNoteFormL.submit);

  // Provide feedback to the user regarding this form actions
  useSubmitToast(editNoteFormL.submit, "[EDIT NOTE]", "The note has been updated.", undefined, "/notes", true);

  // Create a ref to the editor component
  const editorRef = useRef<MDXEditorMethods>(null);

  // Function to be called when the transcription is processed
  const handleRecordingProcessed = useCallback(({ actionStatus, result }: Awaited<ReturnType<typeof transcribeNote>>) => {
    // Only update the form if the transcription was successful
    if (actionStatus !== "succeeded" || !result) return;

    // Extract only the content from the result
    const { content } = result;

    // Insert the transcribed content into the markdown field at the cursor's location
    editorRef.current?.focus();
    editorRef.current?.insertMarkdown(content);
  }, []);

  return (
    <Card className="max-w-4xl">
      {!inNoteModal ? (
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
          <CardDescription>To edit an existing note</CardDescription>
          <CardAction>
            <AudioRecorder
              recordingFieldName="recording"
              processRecordingAction={transcribeNote}
              onRecordingProcessed={handleRecordingProcessed}
              startRecordingText="Start Transcribing"
              stopRecordingText="Stop Transcribing"
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
            />
          </CardAction>
        </CardHeader>
      )}
      <CardContent>
        <editNoteFormL.Initialize defaultValues={{ title, content }}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
            }}
          >
            <editNoteFormL.title label="Title" size={40} maxLength={51} spellCheck autoComplete="off" placeholder="e.g., Quick Reminder" />
            <br />
            <editNoteFormL.content
              ref={editorRef}
              label="Content"
              spellCheck={false}
              placeholder="e.g., Buy cat food. Call mom. Pay electricity bill. Remember to bring umbrella tomorrow in case it rains."
            />
            <br />
            <SubmitStatus form={editNoteFormL} formName="[EDIT NOTE]" succeededDesc="The note has been updated." />
            <FormSubmit form={editNoteFormL} submitIcon={<DocumentTextIcon className="size-9" />} submitText="Update Note" />
          </form>
        </editNoteFormL.Initialize>
      </CardContent>
    </Card>
  );
}
