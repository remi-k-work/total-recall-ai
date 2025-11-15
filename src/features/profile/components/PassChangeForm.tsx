/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState, useEffect, useRef } from "react";

// server actions and mutations
import passChange from "@/features/profile/actions/passChangeForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form-nextjs";
import { useAppForm } from "@/components/form";
import { PassChangeFormSchema, PassSetupFormSchema } from "@/features/profile/schemas/passChangeForm";
import usePassChangeFormFeedback from "@/features/profile/hooks/feedbacks/usePassChangeForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import InfoLine from "@/components/form/InfoLine";

// assets
import { KeyIcon } from "@heroicons/react/24/outline";

// types
interface PassChangeFormProps {
  hasCredential: boolean;
}

// constants
import { FORM_OPTIONS_CHANGE, FORM_OPTIONS_SETUP, INITIAL_FORM_STATE } from "@/features/profile/constants/passChangeForm";

export default function PassChangeForm({ hasCredential }: PassChangeFormProps) {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(passChange.bind(null, hasCredential), INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset, store } = useAppForm({
    ...(hasCredential ? FORM_OPTIONS_CHANGE : FORM_OPTIONS_SETUP),
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
  const { feedbackMessage, hideFeedbackMessage } = usePassChangeFormFeedback(hasPressedSubmitRef, formState, reset, store, hasCredential);

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
            <CardTitle>{hasCredential ? "Password Change" : "Password Setup"}</CardTitle>
            <CardDescription>{hasCredential ? "Enter your new password below" : "Setup your password below"}</CardDescription>
          </CardHeader>
          <CardContent>
            {hasCredential ? (
              <>
                <AppField
                  name={"currentPassword" as any}
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
              </>
            ) : (
              <>
                <AppField
                  name="newPassword"
                  validators={{ onChange: PassSetupFormSchema.shape.newPassword }}
                  children={(field) => (
                    <field.PasswordField label="New Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
                  )}
                />
                <AppField
                  name="confirmPassword"
                  validators={{ onChange: PassSetupFormSchema.shape.confirmPassword }}
                  children={(field) => (
                    <field.PasswordField label="Confirm Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
                  )}
                />
              </>
            )}
          </CardContent>
          <CardFooter>
            <InfoLine message={feedbackMessage} />
            <FormSubmit
              submitIcon={<KeyIcon className="size-9" />}
              submitText={hasCredential ? "Change Password" : "Setup Password"}
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
