/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState } from "react";

// server actions and mutations
import forgotPass from "@/features/auth/actions/forgotPassForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useAppForm } from "@/components/form";
import { ForgotPassFormSchema } from "@/features/auth/schemas/forgotPassForm";
import useForgotPassFormFeedback from "@/features/auth/hooks/feedbacks/useForgotPassForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import InfoLine from "@/components/form/InfoLine";

// assets
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/auth/constants/forgotPassForm";

export default function ForgotPassForm() {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(forgotPass, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset, store } = useAppForm({
    ...FORM_OPTIONS,
    transform: useTransform((baseForm) => mergeForm(baseForm, formState), [formState]),
  });

  // Provide feedback to the user regarding this form actions
  const { feedbackMessage, hideFeedbackMessage } = useForgotPassFormFeedback(formState, reset, store);

  return (
    <AppForm>
      <form action={formAction} onSubmit={() => handleSubmit()}>
        <Card>
          <CardHeader>
            <CardTitle>Forgot Your Password?</CardTitle>
            <CardDescription>Enter your email below to reset password</CardDescription>
          </CardHeader>
          <CardContent>
            <AppField
              name="email"
              validators={{ onChange: ForgotPassFormSchema.shape.email }}
              children={(field) => (
                <field.TextField label="Email" size={40} maxLength={50} spellCheck={false} autoComplete="email" placeholder="e.g. john.doe@gmail.com" />
              )}
            />
          </CardContent>
          <CardFooter>
            <InfoLine message={feedbackMessage} />
            <FormSubmit
              submitIcon={<PaperAirplaneIcon className="size-9" />}
              submitText="Send Reset Link"
              isPending={isPending}
              onClearedForm={hideFeedbackMessage}
            />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
