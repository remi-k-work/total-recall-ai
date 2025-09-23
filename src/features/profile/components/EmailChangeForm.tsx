/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState } from "react";

// server actions and mutations
import emailChange from "@/features/profile/actions/emailChangeForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useAppForm } from "@/components/form";
import { EmailChangeFormSchema } from "@/features/profile/schemas/emailChangeForm";
import useEmailChangeFormFeedback from "@/features/profile/hooks/feedbacks/useEmailChangeForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";

// assets
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

// types
interface EmailChangeFormProps {
  currentEmail: string;
}

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/profile/constants/emailChangeForm";

export default function EmailChangeForm({ currentEmail }: EmailChangeFormProps) {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(emailChange, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset } = useAppForm({
    ...FORM_OPTIONS,
    defaultValues: { ...FORM_OPTIONS.defaultValues, newEmail: currentEmail },
    transform: useTransform((baseForm) => mergeForm(baseForm, formState), [formState]),
  });

  // Provide feedback to the user regarding this form actions
  useEmailChangeFormFeedback(formState, reset);

  return (
    <AppForm>
      <form action={formAction} onSubmit={() => handleSubmit()}>
        <Card>
          <CardHeader>
            <CardTitle>Email Change</CardTitle>
            <CardDescription>Enter your new email below</CardDescription>
          </CardHeader>
          <CardContent>
            <AppField
              name="newEmail"
              validators={{ onChange: EmailChangeFormSchema.shape.newEmail }}
              children={(field) => (
                <field.TextField label="New Email" size={40} maxLength={50} spellCheck={false} autoComplete="email" placeholder="e.g. john.doe@gmail.com" />
              )}
            />
          </CardContent>
          <CardFooter>
            <FormSubmit submitIcon={<PaperAirplaneIcon className="size-9" />} submitText="Request Email Change" isPending={isPending} showCancel={false} />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
