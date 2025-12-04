/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState, useCallback, useEffect, useRef } from "react";

// server actions and mutations
import editAvailNoteTags from "@/features/notes/actions/editAvailNoteTagsForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form-nextjs";
import { useAppForm } from "@/components/form";
import { EditAvailNoteTagsFormSchema } from "@/features/notes/schemas/editAvailNoteTagsForm";
import useEditAvailNoteTagsFormFeedback from "@/features/notes/hooks/feedbacks/useEditAvailNoteTagsForm";

// components
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import InfoLine from "@/components/form/InfoLine";
import AudioRecorder from "@/components/AudioRecorder";

// assets
import { DocumentTextIcon } from "@heroicons/react/24/outline";

// types
import type { getAllNoteTags } from "@/features/notes/db";

interface EditAvailNoteTagsFormProps {
  noteTags: Awaited<ReturnType<typeof getAllNoteTags>>;
  inNoteModal?: boolean;
}

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/notes/constants/editAvailNoteTagsForm";

export default function EditAvialNoteTagsForm({ noteTags, inNoteModal = false }: EditAvailNoteTagsFormProps) {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(editAvailNoteTags, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset, store } = useAppForm({
    ...FORM_OPTIONS,
    defaultValues: { ...FORM_OPTIONS.defaultValues, ...noteTags.map(({ name }) => ({ name })) },
    transform: useTransform((baseForm) => mergeForm(baseForm, formState), [formState]),
  });

  // Track if the user has pressed the submit button
  const hasPressedSubmitRef = useRef(false);

  // All this new cleanup code is for the <Activity /> boundary
  useEffect(() => {
    // Reset the flag when the component unmounts
    return () => {
      hasPressedSubmitRef.current = false;
    };
  }, []);

  // Provide feedback to the user regarding this form actions
  const { feedbackMessage, hideFeedbackMessage } = useEditAvailNoteTagsFormFeedback(hasPressedSubmitRef, formState, reset, store);

  return (
    <AppForm>
      <form
        action={formAction}
        onSubmit={async () => {
          await handleSubmit();
          hasPressedSubmitRef.current = true;
        }}
      >
        <Card className="max-w-4xl">
          {!inNoteModal && (
            <CardHeader>
              <CardTitle>Edit Note</CardTitle>
              <CardDescription>To edit an existing note</CardDescription>
            </CardHeader>
          )}
          <CardContent>
            <AppField
              name="title"
              validators={{ onChange: EditNoteFormSchema.shape.title }}
              children={(field) => <field.TextField label="Title" size={40} maxLength={51} spellCheck autoComplete="off" placeholder="e.g. Quick Reminder" />}
            />
            <AppField
              name="markdown"
              children={(field) => (
                <field.MarkdownField
                  ref={markdownFieldRef}
                  label="Content"
                  markdown=""
                  spellCheck={false}
                  placeholder="e.g. Buy cat food. Call mom. Pay electricity bill. Remember to bring umbrella tomorrow in case it rains."
                  onChange={(markdown) => field.form.setFieldValue("content", markdown)}
                />
              )}
            />
            <AppField
              name="content"
              validators={{ onChange: EditNoteFormSchema.shape.content }}
              children={(field) => (
                <field.TextAreaField
                  cols={50}
                  rows={8}
                  maxLength={2049}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="e.g. Buy cat food. Call mom. Pay electricity bill. Remember to bring umbrella tomorrow in case it rains."
                  hidden
                />
              )}
            />
          </CardContent>
          <CardFooter>
            <InfoLine message={feedbackMessage} />
            <FormSubmit
              submitIcon={<DocumentTextIcon className="size-9" />}
              submitText="Update Note"
              isPending={isPending}
              onClearedForm={() => {
                hideFeedbackMessage();
                markdownFieldRef.current?.setMarkdown(content);
              }}
            />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
