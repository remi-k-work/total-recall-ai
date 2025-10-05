/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState } from "react";

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
import { PlusCircleIcon } from "@heroicons/react/24/outline";

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/notes/constants/newNoteForm";

export default function NewNoteForm() {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(newNote, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset, store } = useAppForm({
    ...FORM_OPTIONS,
    transform: useTransform((baseForm) => mergeForm(baseForm, formState), [formState]),
  });

  // Provide feedback to the user regarding this form actions
  const { feedbackMessage, hideFeedbackMessage } = useNewNoteFormFeedback(formState, reset, store);

  return (
    <AppForm>
      <form action={formAction} onSubmit={() => handleSubmit()}>
        <Card>
          <CardHeader>
            <CardTitle>New Note</CardTitle>
            <CardDescription>To create a new note</CardDescription>
          </CardHeader>
          <CardContent>
            <AppField
              name="title"
              validators={{ onChange: NewNoteFormSchema.shape.title }}
              children={(field) => <field.TextField label="Title" size={40} maxLength={51} spellCheck autoComplete="off" placeholder="e.g. Quick Reminder" />}
            />
            <AppField
              name="content"
              validators={{ onChange: NewNoteFormSchema.shape.content }}
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
              submitIcon={<PlusCircleIcon className="size-9" />}
              submitText="Create New Note"
              isPending={isPending}
              onClearedForm={hideFeedbackMessage}
            />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
