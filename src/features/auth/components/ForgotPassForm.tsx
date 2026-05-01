"use client";

// services, features, and other libraries
import { Effect } from "effect";
import { useAtomSet } from "@effect-atom/atom-react";
import { FormReact } from "@lucas-barake/effect-form-react";
import { RpcAuthClient } from "@/features/auth/rpc/client";
import { forgotPassFormBuilder } from "@/features/auth/schemas";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { TextInput, TextInputSkeleton } from "@/components/Form/Inputs";
import { FormSubmit, FormSubmitSkeleton, SubmitStatus } from "@/components/Form";

// assets
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const forgotPassForm = FormReact.make(forgotPassFormBuilder, {
  runtime: RuntimeAtom,
  fields: { email: TextInput },
  onSubmit: (_, { decoded: { email } }) =>
    Effect.gen(function* () {
      const { forgotPassForm } = yield* RpcAuthClient;
      yield* forgotPassForm({ email });
    }),
});

export default function ForgotPassForm() {
  // Get the form context
  const submit = useAtomSet(forgotPassForm.submit);

  // Provide feedback to the user regarding this form actions
  useSubmitToast(forgotPassForm.submit, "[FORGOT YOUR PASSWORD?]", "We have sent the password reset link.");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Your Password?</CardTitle>
        <CardDescription>Enter your email below to reset password</CardDescription>
      </CardHeader>
      <CardContent>
        <forgotPassForm.Initialize defaultValues={{ email: "" }}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
            }}
          >
            <forgotPassForm.email label="Email" size={40} maxLength={50} spellCheck={false} autoComplete="email" placeholder="e.g. john.doe@gmail.com" />
            <br />
            <SubmitStatus form={forgotPassForm} formName="[FORGOT YOUR PASSWORD?]" succeededDesc="We have sent the password reset link." />
            <FormSubmit form={forgotPassForm} submitIcon={<PaperAirplaneIcon className="size-9" />} submitText="Send Reset Link" />
          </form>
        </forgotPassForm.Initialize>
      </CardContent>
    </Card>
  );
}

export function ForgotPassFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Your Password?</CardTitle>
        <CardDescription>Enter your email below to reset password</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <TextInputSkeleton
            formName="[FORGOT YOUR PASSWORD?]"
            label="Email"
            size={40}
            maxLength={50}
            spellCheck={false}
            autoComplete="email"
            placeholder="e.g. john.doe@gmail.com"
          />
          <br />
          <FormSubmitSkeleton submitIcon={<PaperAirplaneIcon className="size-9" />} submitText="Send Reset Link" />
        </form>
      </CardContent>
    </Card>
  );
}
