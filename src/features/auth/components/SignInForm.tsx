/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState, useEffect, useRef } from "react";

// next
import Link from "next/link";

// server actions and mutations
import signIn from "@/features/auth/actions/signInForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form-nextjs";
import { useAppForm } from "@/components/form";
import { SignInFormSchema } from "@/features/auth/schemas/signInForm";
import useSignInFormFeedback from "@/features/auth/hooks/feedbacks/useSignInForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import InfoLine from "@/components/form/InfoLine";
import SignInSocial from "./SignInSocial";

// assets
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

// types
import type { Route } from "next";

interface SignInFormProps {
  redirect?: Route;
}

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/auth/constants/signInForm";

export default function SignInForm({ redirect }: SignInFormProps) {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(signIn, INITIAL_FORM_STATE);
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
  const { feedbackMessage, hideFeedbackMessage } = useSignInFormFeedback(hasPressedSubmitRef, formState, reset, store, redirect);

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
            <CardTitle>Sign In</CardTitle>
            <CardDescription>To continue to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <AppField
              name="email"
              validators={{ onChange: SignInFormSchema.shape.email }}
              children={(field) => (
                <field.TextField label="Email" size={40} maxLength={50} spellCheck={false} autoComplete="email" placeholder="e.g. john.doe@gmail.com" />
              )}
            />
            <AppField
              name="password"
              validators={{ onChange: SignInFormSchema.shape.password }}
              children={(field) => (
                <field.PasswordField
                  label="Password"
                  forgotPassHref="/forgot-password"
                  size={40}
                  maxLength={129}
                  autoComplete="current-password"
                  placeholder="e.g. P@ssw0rd!"
                />
              )}
            />
            <AppField name="rememberMe" children={(field) => <field.CheckBoxField label="Remember Me (recommended on trusted devices)" />} />
          </CardContent>
          <CardFooter>
            <InfoLine message={feedbackMessage} />
            <FormSubmit
              submitIcon={<ArrowRightEndOnRectangleIcon className="size-9" />}
              submitText="Sign In"
              isPending={isPending}
              onClearedForm={hideFeedbackMessage}
            />
            <section className="mt-9 grid gap-4 border-t border-b px-6 py-6">
              <SignInSocial provider="google" redirect={redirect} />
              <SignInSocial provider="github" redirect={redirect} />
            </section>
            <p className="mt-9 text-center">
              New to Total Recall AI?&nbsp;
              <Link href="/sign-up" className="link">
                Create an Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
