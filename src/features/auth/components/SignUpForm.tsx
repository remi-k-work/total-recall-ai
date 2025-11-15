/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState, useEffect, useRef } from "react";

// server actions and mutations
import signUp from "@/features/auth/actions/signUpForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form-nextjs";
import { useAppForm } from "@/components/form";
import { SignUpFormSchema } from "@/features/auth/schemas/signUpForm";
import useSignUpFormFeedback from "@/features/auth/hooks/feedbacks/useSignUpForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import InfoLine from "@/components/form/InfoLine";

// assets
import { UserIcon } from "@heroicons/react/24/outline";

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/auth/constants/signUpForm";

export default function SignUpForm() {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(signUp, INITIAL_FORM_STATE);
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
  const { feedbackMessage, hideFeedbackMessage } = useSignUpFormFeedback(hasPressedSubmitRef, formState, reset, store);

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
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>To create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <AppField
              name="name"
              validators={{ onChange: SignUpFormSchema.shape.name }}
              children={(field) => <field.TextField label="Name" size={40} maxLength={26} spellCheck={false} autoComplete="name" placeholder="e.g. John Doe" />}
            />
            <AppField
              name="email"
              validators={{ onChange: SignUpFormSchema.shape.email }}
              children={(field) => (
                <field.TextField label="Email" size={40} maxLength={50} spellCheck={false} autoComplete="email" placeholder="e.g. john.doe@gmail.com" />
              )}
            />
            <AppField
              name="password"
              validators={{ onChange: SignUpFormSchema.shape.password }}
              children={(field) => <field.PasswordField label="Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />}
            />
            <AppField
              name="confirmPassword"
              validators={{ onChange: SignUpFormSchema.shape.confirmPassword }}
              children={(field) => (
                <field.PasswordField label="Confirm Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
              )}
            />
          </CardContent>
          <CardFooter>
            <InfoLine message={feedbackMessage} />
            <FormSubmit
              submitIcon={<UserIcon className="size-9" />}
              submitText="Create New Account"
              isPending={isPending}
              onClearedForm={hideFeedbackMessage}
            />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
