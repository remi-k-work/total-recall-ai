"use client";

// services, features, and other libraries
import { Effect } from "effect";
import { useAtomSet } from "@effect-atom/atom-react";
import { FormReact } from "@lucas-barake/effect-form-react";
import { RpcProfileClient } from "@/features/profile/rpc/client";
import { emailChangeFormBuilder } from "@/features/profile/schemas";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { TextInput } from "@/components/Form/Inputs";
import { FormSubmit, SubmitStatus } from "@/components/Form";

// assets
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

// types
import type { User } from "@/services/better-auth/auth";

interface EmailChangeFormProps {
  user: User;
}

const emailChangeForm = FormReact.make(emailChangeFormBuilder, {
  runtime: RuntimeAtom,
  fields: { newEmail: TextInput },
  onSubmit: (_, { decoded: { newEmail } }) =>
    Effect.gen(function* () {
      const { emailChangeForm } = yield* RpcProfileClient;
      yield* emailChangeForm({ newEmail });
    }),
});

export default function EmailChangeForm({ user: { email: newEmail, emailVerified: needsApproval } }: EmailChangeFormProps) {
  // Get the form context
  const submit = useAtomSet(emailChangeForm.submit);

  // Provide feedback to the user regarding this form actions
  useSubmitToast(
    emailChangeForm.submit,
    "[EMAIL CHANGE]",
    needsApproval
      ? "The email change has been initiated and needs to be approved. Please check your current email address for the approval link."
      : "Your email has been changed successfully. A verification email has been sent to your new email address.",
    undefined,
    undefined,
    true
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Change</CardTitle>
        <CardDescription>Enter your new email below</CardDescription>
      </CardHeader>
      <CardContent>
        <emailChangeForm.Initialize defaultValues={{ newEmail }}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
            }}
          >
            <emailChangeForm.newEmail
              label="New Email"
              size={40}
              maxLength={50}
              spellCheck={false}
              autoComplete="email"
              placeholder="e.g. john.doe@gmail.com"
            />
            <br />
            <SubmitStatus
              form={emailChangeForm}
              formName="[EMAIL CHANGE]"
              succeededDesc={
                needsApproval
                  ? "The email change has been initiated and needs to be approved. Please check your current email address for the approval link."
                  : "Your email has been changed successfully. A verification email has been sent to your new email address."
              }
            />
            <FormSubmit form={emailChangeForm} submitIcon={<PaperAirplaneIcon className="size-9" />} submitText="Request Email Change" showCancel={false} />
          </form>
        </emailChangeForm.Initialize>
      </CardContent>
    </Card>
  );
}
