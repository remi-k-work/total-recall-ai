"use client";

// next
import Link from "next/link";

// services, features, and other libraries
import { Effect } from "effect";
import { useAtomSet } from "@effect-atom/atom-react";
import { FormReact } from "@lucas-barake/effect-form-react";
import { RpcAuthClient } from "@/features/auth/rpc/client";
import { signInFormBuilder } from "@/features/auth/schemas";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { CheckBoxInput, CheckBoxInputSkeleton, PasswordInput, PasswordInputSkeleton, TextInput, TextInputSkeleton } from "@/components/Form/Inputs";
import { FormSubmit, FormSubmitSkeleton, SubmitStatus } from "@/components/Form";
import SignInSocial, { SignInSocialSkeleton } from "./SignInSocial";

// assets
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

// types
import type { Route } from "next";

interface SignInFormProps {
  redirect?: Route;
}

const signInForm = FormReact.make(signInFormBuilder, {
  runtime: RuntimeAtom,
  fields: { email: TextInput, password: PasswordInput, rememberMe: CheckBoxInput },
  onSubmit: (_, { decoded: { email, password, rememberMe } }) =>
    Effect.gen(function* () {
      const { signInForm } = yield* RpcAuthClient;
      yield* signInForm({ email, password, rememberMe });
    }),
});

export default function SignInForm({ redirect }: SignInFormProps) {
  // Get the form context
  const submit = useAtomSet(signInForm.submit);

  // Provide feedback to the user regarding this form actions
  useSubmitToast(signInForm.submit, "[SIGN IN]", "You signed in successfully.", undefined, redirect ?? "/dashboard", true);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>To continue to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <signInForm.Initialize defaultValues={{ email: "", password: "", rememberMe: false }}>
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                submit();
              }}
            >
              <signInForm.email label="Email" size={40} maxLength={50} spellCheck={false} autoComplete="email" placeholder="e.g. john.doe@gmail.com" />
              <br />
              <signInForm.password
                label="Password"
                forgotPassHref="/forgot-password"
                forgotPassText="Forgot your password?"
                size={40}
                maxLength={129}
                autoComplete="current-password"
                placeholder="e.g. P@ssw0rd!"
              />
              <br />
              <signInForm.rememberMe label="Remember Me (recommended on trusted devices)" />
              <br />
              <SubmitStatus form={signInForm} formName="[SIGN IN]" succeededDesc="You signed in successfully." />
              <FormSubmit form={signInForm} submitIcon={<ArrowRightEndOnRectangleIcon className="size-9" />} submitText="Sign In" />
            </form>
          </signInForm.Initialize>
        </CardContent>
        <CardFooter>
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
      <SignInFormSkeleton />
    </>
  );
}

export function SignInFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>To continue to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <TextInputSkeleton
            formName="[SIGN IN]"
            label="Email"
            size={40}
            maxLength={50}
            spellCheck={false}
            autoComplete="email"
            placeholder="e.g. john.doe@gmail.com"
          />
          <br />
          <PasswordInputSkeleton
            formName="[SIGN IN]"
            label="Password"
            forgotPassHref="/forgot-password"
            forgotPassText="Forgot your password?"
            size={40}
            maxLength={129}
            autoComplete="current-password"
            placeholder="e.g. P@ssw0rd!"
          />
          <br />
          <CheckBoxInputSkeleton formName="[SIGN IN]" label="Remember Me (recommended on trusted devices)" />
          <br />
          <FormSubmitSkeleton submitIcon={<ArrowRightEndOnRectangleIcon className="size-9" />} submitText="Sign In" />
        </form>
      </CardContent>
      <CardFooter>
        <section className="mt-9 grid gap-4 border-t border-b px-6 py-6">
          <SignInSocialSkeleton provider="google" />
          <SignInSocialSkeleton provider="github" />
        </section>
        <p className="mt-9 text-center">
          New to Total Recall AI?&nbsp;
          <Link href="/sign-up" className="link">
            Create an Account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
