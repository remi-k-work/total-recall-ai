/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState } from "react";

// server actions and mutations
import signUp from "@/features/auth/actions/signUpForm";

// other libraries
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useAppForm } from "@/components/form";
import { SignUpFormSchema } from "@/features/auth/schemas/signUpForm";
import useSignUpFormFeedback from "@/features/auth/hooks/useSignUpFormFeedback";

// assets
import { UserIcon } from "@heroicons/react/24/solid";

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/auth/constants/signUpForm";

export default function SignUpForm() {
  const [formState, formAction, isPending] = useActionState(signUp, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset } = useAppForm({
    ...FORM_OPTIONS,
    transform: useTransform((baseForm) => mergeForm(baseForm, formState), [formState]),
  });

  // Provide feedback to the user regarding sign up form actions
  useSignUpFormFeedback(formState, reset);

  return (
    <AppForm>
      <form action={formAction} className="bg-background mx-auto w-full max-w-4xl rounded-xl p-3" onSubmit={() => handleSubmit()}>
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
        <br />
        <FormSubmit submitIcon={<UserIcon className="size-9" />} submitText="Create New Account" isPending={isPending} />
      </form>
    </AppForm>
  );
}
