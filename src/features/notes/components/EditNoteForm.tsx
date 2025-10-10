/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState } from "react";

// server actions and mutations
import editNote from "@/features/notes/actions/editNoteForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useAppForm } from "@/components/form";
import { EditNoteFormSchema } from "@/features/notes/schemas/editNoteForm";
import useEditNoteFormFeedback from "@/features/notes/hooks/feedbacks/useEditNoteForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import InfoLine from "@/components/form/InfoLine";

// assets
import { DocumentTextIcon } from "@heroicons/react/24/outline";

// types
import type { getNote } from "@/features/notes/db";

interface EditNoteFormProps {
  note: Exclude<Awaited<ReturnType<typeof getNote>>, undefined>;
}

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/notes/constants/editNoteForm";

export default function EditNoteForm({ note: { id: noteId, title, content } }: EditNoteFormProps) {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(editNote.bind(null, noteId), INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset, store } = useAppForm({
    ...FORM_OPTIONS,
    defaultValues: { ...FORM_OPTIONS.defaultValues, title, content },
    transform: useTransform((baseForm) => mergeForm(baseForm, formState), [formState]),
  });

  // Provide feedback to the user regarding this form actions
  const { feedbackMessage, hideFeedbackMessage } = useEditNoteFormFeedback(formState, reset, store);

  return (
    <AppForm>
      <form action={formAction} onSubmit={() => handleSubmit()}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Note</CardTitle>
            <CardDescription>To edit an existing note</CardDescription>
          </CardHeader>
          <CardContent>
            <AppField
              name="title"
              validators={{ onChange: EditNoteFormSchema.shape.title }}
              children={(field) => <field.TextField label="Title" size={40} maxLength={51} spellCheck autoComplete="off" placeholder="e.g. Quick Reminder" />}
            />
            <AppField
              name="content"
              validators={{ onChange: EditNoteFormSchema.shape.content }}
              children={(field) => (
                <field.TextAreaField
                  label="Content"
                  cols={50}
                  rows={8}
                  maxLength={2049}
                  spellCheck
                  autoComplete="off"
                  placeholder="e.g. Buy cat food. Call mom. Pay electricity bill. Remember to bring umbrella tomorrow in case it rains."
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
              onClearedForm={hideFeedbackMessage}
            />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
