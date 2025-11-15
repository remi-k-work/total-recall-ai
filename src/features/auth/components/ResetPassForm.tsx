/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState, useEffect, useRef } from "react";

// server actions and mutations
import resetPass from "@/features/auth/actions/resetPassForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form-nextjs";
import { useAppForm } from "@/components/form";
import { ResetPassFormSchema } from "@/features/auth/schemas/resetPassForm";
import useResetPassFormFeedback from "@/features/auth/hooks/feedbacks/useResetPassForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import InfoLine from "@/components/form/InfoLine";

// assets
import { KeyIcon } from "@heroicons/react/24/outline";

// types
interface ResetPassFormProps {
  token: string;
}

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/auth/constants/resetPassForm";

export default function ResetPassForm({ token }: ResetPassFormProps) {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(resetPass.bind(null, token), INITIAL_FORM_STATE);
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
  const { feedbackMessage, hideFeedbackMessage } = useResetPassFormFeedback(hasPressedSubmitRef, formState, reset, store);

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
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <AppField
              name="newPassword"
              validators={{ onChange: ResetPassFormSchema.shape.newPassword }}
              children={(field) => (
                <field.PasswordField label="New Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
              )}
            />
            <AppField
              name="confirmPassword"
              validators={{ onChange: ResetPassFormSchema.shape.confirmPassword }}
              children={(field) => (
                <field.PasswordField label="Confirm Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
              )}
            />
          </CardContent>
          <CardFooter>
            <InfoLine message={feedbackMessage} />
            <FormSubmit submitIcon={<KeyIcon className="size-9" />} submitText="Reset Password" isPending={isPending} onClearedForm={hideFeedbackMessage} />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
