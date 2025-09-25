/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState } from "react";

// server actions and mutations
import passChange from "@/features/profile/actions/passChangeForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useAppForm } from "@/components/form";
import { PassChangeFormSchema } from "@/features/profile/schemas/passChangeForm";
import usePassChangeFormFeedback from "@/features/profile/hooks/feedbacks/usePassChangeForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import InfoLine from "@/components/form/InfoLine";

// assets
import { KeyIcon } from "@heroicons/react/24/outline";

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/profile/constants/passChangeForm";

export default function PassChangeForm() {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(passChange, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset, store } = useAppForm({
    ...FORM_OPTIONS,
    transform: useTransform((baseForm) => mergeForm(baseForm, formState), [formState]),
  });

  // Provide feedback to the user regarding this form actions
  const { feedbackMessage, hideFeedbackMessage } = usePassChangeFormFeedback(formState, reset, store);

  return (
    <AppForm>
      <form action={formAction} onSubmit={() => handleSubmit()}>
        <Card>
          <CardHeader>
            <CardTitle>Password Change</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <AppField
              name="currentPassword"
              validators={{ onChange: PassChangeFormSchema.shape.currentPassword }}
              children={(field) => (
                <field.PasswordField label="Current Password" size={40} maxLength={129} autoComplete="current-password" placeholder="e.g. P@ssw0rd!" />
              )}
            />
            <AppField
              name="newPassword"
              validators={{ onChange: PassChangeFormSchema.shape.newPassword }}
              children={(field) => (
                <field.PasswordField label="New Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
              )}
            />
            <AppField
              name="confirmPassword"
              validators={{ onChange: PassChangeFormSchema.shape.confirmPassword }}
              children={(field) => (
                <field.PasswordField label="Confirm Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
              )}
            />
          </CardContent>
          <CardFooter>
            <InfoLine message={feedbackMessage} />
            <FormSubmit
              submitIcon={<KeyIcon className="size-9" />}
              submitText="Change Password"
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
