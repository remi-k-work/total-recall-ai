/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState, useEffect, useRef } from "react";

// server actions and mutations
import newNote from "@/features/notes/actions/newNoteForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useAppForm } from "@/components/form";
import { NewNoteFormSchema } from "@/features/notes/schemas/newNoteForm";
import useNewNoteFormFeedback from "@/features/notes/hooks/feedbacks/useNewNoteForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import InfoLine from "@/components/form/InfoLine";

// assets
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

// types
import type { MDXEditorMethods } from "@mdxeditor/editor";

interface NewNoteFormProps {
  inNoteModal?: boolean;
}

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/notes/constants/newNoteForm";

export default function NewNoteForm({ inNoteModal = false }: NewNoteFormProps) {
  // Create a ref to the editor component
  const markdownFieldRef = useRef<MDXEditorMethods>(null);

  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(newNote, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset, store } = useAppForm({
    ...FORM_OPTIONS,
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
  const { feedbackMessage, hideFeedbackMessage } = useNewNoteFormFeedback(
    hasPressedSubmitRef,
    formState,
    () => {
      reset();
      markdownFieldRef.current?.setMarkdown("");
    },
    store,
  );

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
              <CardTitle>New Note</CardTitle>
              <CardDescription>To create a new note</CardDescription>
            </CardHeader>
          )}
          <CardContent>
            <AppField
              name="title"
              validators={{ onChange: NewNoteFormSchema.shape.title }}
              children={(field) => <field.TextField label="Title" size={40} maxLength={51} spellCheck autoComplete="off" placeholder="e.g. Quick Reminder" />}
            />
            <AppField
              name="markdown"
              children={(field) => (
                <field.MarkdownField
                  ref={markdownFieldRef}
                  label="Content"
                  markdown={field.form.getFieldValue("content")}
                  spellCheck={false}
                  placeholder="e.g. Buy cat food. Call mom. Pay electricity bill. Remember to bring umbrella tomorrow in case it rains."
                  onChange={(markdown) => field.form.setFieldValue("content", markdown)}
                />
              )}
            />
            <AppField
              name="content"
              validators={{ onChange: NewNoteFormSchema.shape.content }}
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
              submitIcon={<DocumentPlusIcon className="size-9" />}
              submitText="Create New Note"
              isPending={isPending}
              onClearedForm={() => {
                hideFeedbackMessage();
                markdownFieldRef.current?.setMarkdown("");
              }}
            />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
