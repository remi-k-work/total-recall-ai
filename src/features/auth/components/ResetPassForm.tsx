/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState } from "react";

// server actions and mutations
import resetPass from "@/features/auth/actions/resetPassForm";

// other libraries
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useAppForm } from "@/components/form";
import { ResetPassFormSchema } from "@/features/auth/schemas/resetPassForm";
import useResetPassFormFeedback from "@/features/auth/hooks/feedbacks/useResetPassForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";

// assets
import { KeyIcon } from "@heroicons/react/24/outline";

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/auth/constants/resetPassForm";

export default function ResetPassForm() {
  const [formState, formAction, isPending] = useActionState(resetPass, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset } = useAppForm({
    ...FORM_OPTIONS,
    transform: useTransform((baseForm) => mergeForm(baseForm, formState), [formState]),
  });

  // Provide feedback to the user regarding this form actions
  useResetPassFormFeedback(formState, reset);

  return (
    <AppForm>
      <form action={formAction} onSubmit={() => handleSubmit()}>
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
          </CardContent>
          <CardFooter>
            <FormSubmit submitIcon={<KeyIcon className="size-9" />} submitText="Reset Password" isPending={isPending} />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
