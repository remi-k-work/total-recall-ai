"use client";

// services, features, and other libraries
import { Effect } from "effect";
import { useAtomSet } from "@effect-atom/atom-react";
import { FormReact } from "@lucas-barake/effect-form-react";
import { RpcAuthClient } from "@/features/auth/rpc/client";
import { signUpFormBuilder } from "@/features/auth/schemas";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { PasswordInput, PasswordInputSkeleton, TextInput, TextInputSkeleton } from "@/components/Form/Inputs";
import { FormSubmit, FormSubmitSkeleton, SubmitStatus } from "@/components/Form";

// assets
import { UserIcon } from "@heroicons/react/24/outline";

const signUpForm = FormReact.make(signUpFormBuilder, {
  runtime: RuntimeAtom,
  fields: { name: TextInput, email: TextInput, password: PasswordInput, confirmPassword: PasswordInput },
  onSubmit: (_, { decoded: { name, email, password } }) =>
    Effect.gen(function* () {
      const { signUpForm } = yield* RpcAuthClient;
      yield* signUpForm({ name, email, password });
    }),
});

export default function SignUpForm() {
  // Get the form context
  const submit = useAtomSet(signUpForm.submit);

  // Provide feedback to the user regarding this form actions
  useSubmitToast(signUpForm.submit, "[SIGN UP]", "You signed up successfully.", undefined, "/dashboard", true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>To create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <signUpForm.Initialize defaultValues={{ name: "", email: "", password: "", confirmPassword: "" }}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
            }}
          >
            <signUpForm.name label="Name" size={40} maxLength={26} spellCheck={false} autoComplete="name" placeholder="e.g. John Doe" />
            <br />
            <signUpForm.email label="Email" size={40} maxLength={50} spellCheck={false} autoComplete="email" placeholder="e.g. john.doe@gmail.com" />
            <br />
            <signUpForm.password label="Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
            <br />
            <signUpForm.confirmPassword label="Confirm Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
            <br />
            <SubmitStatus form={signUpForm} formName="[SIGN UP]" succeededDesc="You signed up successfully." />
            <FormSubmit form={signUpForm} submitIcon={<UserIcon className="size-9" />} submitText="Create New Account" />
          </form>
        </signUpForm.Initialize>
      </CardContent>
    </Card>
  );
}

export function SignUpFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>To create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <TextInputSkeleton formName="[SIGN UP]" label="Name" size={40} maxLength={26} spellCheck={false} autoComplete="name" placeholder="e.g. John Doe" />
          <br />
          <TextInputSkeleton
            formName="[SIGN UP]"
            label="Email"
            size={40}
            maxLength={50}
            spellCheck={false}
            autoComplete="email"
            placeholder="e.g. john.doe@gmail.com"
          />
          <br />
          <PasswordInputSkeleton formName="[SIGN UP]" label="Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
          <br />
          <PasswordInputSkeleton
            formName="[SIGN UP]"
            label="Confirm Password"
            size={40}
            maxLength={129}
            autoComplete="new-password"
            placeholder="e.g. P@ssw0rd!"
          />
          <br />
          <FormSubmitSkeleton submitIcon={<UserIcon className="size-9" />} submitText="Create New Account" />
        </form>
      </CardContent>
    </Card>
  );
}
