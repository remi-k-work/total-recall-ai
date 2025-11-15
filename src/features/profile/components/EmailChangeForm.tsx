/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState, useEffect, useRef } from "react";

// server actions and mutations
import emailChange from "@/features/profile/actions/emailChangeForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form-nextjs";
import { useAppForm } from "@/components/form";
import { EmailChangeFormSchema } from "@/features/profile/schemas/emailChangeForm";
import useEmailChangeFormFeedback from "@/features/profile/hooks/feedbacks/useEmailChangeForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import InfoLine from "@/components/form/InfoLine";

// assets
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

// types
import type { User } from "@/services/better-auth/auth";

interface EmailChangeFormProps {
  user: User;
}

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/profile/constants/emailChangeForm";

export default function EmailChangeForm({ user: { email: currentEmail } }: EmailChangeFormProps) {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(emailChange, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset, store } = useAppForm({
    ...FORM_OPTIONS,
    defaultValues: { ...FORM_OPTIONS.defaultValues, newEmail: currentEmail },
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
  const { feedbackMessage, hideFeedbackMessage } = useEmailChangeFormFeedback(hasPressedSubmitRef, formState, reset, store);

  return (
    <AppForm>
      <form
        action={formAction}
        onSubmit={async () => {
          await handleSubmit();
          hasPressedSubmitRef.current = true;
        }}
      >
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
            <InfoLine message={feedbackMessage} />
            <FormSubmit
              submitIcon={<PaperAirplaneIcon className="size-9" />}
              submitText="Request Email Change"
              isPending={isPending}
              showCancel={false}
              onClearedForm={hideFeedbackMessage}
            />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
