"use client";

// react
import { useMemo } from "react";

// services, features, and other libraries
import { Effect } from "effect";
import { useAtomSet } from "@effect-atom/atom-react";
import { FormReact } from "@lucas-barake/effect-form-react";
import { RpcAuthClient } from "@/features/auth/rpc/client";
import { resetPassFormBuilder } from "@/features/auth/schemas";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { PasswordInput } from "@/components/Form/Inputs";
import { FormSubmit, SubmitStatus } from "@/components/Form";

// assets
import { KeyIcon } from "@heroicons/react/24/outline";

// types
interface ResetPassFormProps {
  token: string;
}

const resetPassForm = (token: string) =>
  FormReact.make(resetPassFormBuilder, {
    runtime: RuntimeAtom,
    fields: { newPassword: PasswordInput, confirmPassword: PasswordInput },
    onSubmit: (_, { decoded: { newPassword } }) =>
      Effect.gen(function* () {
        const { resetPassForm } = yield* RpcAuthClient;
        yield* resetPassForm({ token, newPassword });
      }),
  });

export default function ResetPassForm({ token }: ResetPassFormProps) {
  // Get the form context
  const resetPassFormL = useMemo(() => resetPassForm(token), [token]);
  const submit = useAtomSet(resetPassFormL.submit);

  // Provide feedback to the user regarding this form actions
  useSubmitToast(resetPassFormL.submit, "[RESET YOUR PASSWORD]", "The password has been reset. Please sign in with your new password.", undefined, "/sign-in");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <resetPassFormL.Initialize defaultValues={{ newPassword: "", confirmPassword: "" }}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
            }}
          >
            <resetPassFormL.newPassword label="New Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
            <br />
            <resetPassFormL.confirmPassword label="Confirm Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
            <br />
            <SubmitStatus
              form={resetPassFormL}
              formName="[RESET YOUR PASSWORD]"
              succeededDesc="The password has been reset. Please sign in with your new password."
            />
            <FormSubmit form={resetPassFormL} submitIcon={<KeyIcon className="size-9" />} submitText="Reset Password" />
          </form>
        </resetPassFormL.Initialize>
      </CardContent>
    </Card>
  );
}
