"use client";

// services, features, and other libraries
import { Effect } from "effect";
import { useAtomSet } from "@effect-atom/atom-react";
import { FormReact } from "@lucas-barake/effect-form-react";
import { RpcDashboardClient } from "@/features/dashboard/rpc/client";
import { verifyEmailFormBuilder } from "@/features/dashboard/schemas";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { TextInput } from "@/components/Form/Inputs";
import { FormSubmit, InfoLine, SubmitStatus } from "@/components/Form";

// assets
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

// types
import type { User } from "@/services/better-auth/auth";

interface VerifyEmailFormProps {
  user: User;
}

const verifyEmailForm = FormReact.make(verifyEmailFormBuilder, {
  runtime: RuntimeAtom,
  fields: { email: TextInput },
  onSubmit: () =>
    Effect.gen(function* () {
      const { verifyEmail } = yield* RpcDashboardClient;
      yield* verifyEmail();
    }),
});

export default function VerifyEmailForm({ user: { email, emailVerified } }: VerifyEmailFormProps) {
  // Get the form context
  const submit = useAtomSet(verifyEmailForm.submit);

  // Provide feedback to the user regarding this form actions
  useSubmitToast(verifyEmailForm.submit, "[VERIFY EMAIL]", "A verification email has been sent to your current email address. Please check your inbox.");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>To access all our features</CardDescription>
      </CardHeader>
      <CardContent>
        <verifyEmailForm.Initialize defaultValues={{ email }}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
            }}
          >
            <verifyEmailForm.email
              label="Email"
              size={40}
              maxLength={50}
              spellCheck={false}
              autoComplete="email"
              placeholder="e.g. john.doe@gmail.com"
              disabled
            />
            <br />
            {emailVerified ? (
              <InfoLine message="Your email has been verified. Thank you!" className="mx-0 mb-0" />
            ) : (
              <>
                <SubmitStatus
                  form={verifyEmailForm}
                  formName="[VERIFY EMAIL]"
                  succeededDesc="A verification email has been sent to your current email address. Please check your inbox."
                />
                <FormSubmit
                  form={verifyEmailForm}
                  submitIcon={<CheckBadgeIcon className="size-9" />}
                  submitText="Verify Email"
                  showReset={false}
                  showCancel={false}
                  isStateless
                  cooldown="9 seconds"
                />
              </>
            )}
          </form>
        </verifyEmailForm.Initialize>
      </CardContent>
    </Card>
  );
}
