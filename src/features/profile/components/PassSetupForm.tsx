"use client";

// services, features, and other libraries
import { Effect } from "effect";
import { useAtomSet } from "@effect-atom/atom-react";
import { FormReact } from "@lucas-barake/effect-form-react";
import { RpcProfileClient } from "@/features/profile/rpc/client";
import { passSetupFormBuilder } from "@/features/profile/schemas";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { PasswordInput } from "@/components/Form/Inputs";
import { FormSubmit, SubmitStatus } from "@/components/Form";

// assets
import { KeyIcon } from "@heroicons/react/24/outline";

const passSetupForm = FormReact.make(passSetupFormBuilder, {
  runtime: RuntimeAtom,
  fields: { newPassword: PasswordInput, confirmPassword: PasswordInput },
  onSubmit: (_, { decoded: { newPassword } }) =>
    Effect.gen(function* () {
      const { passChangeForm } = yield* RpcProfileClient;
      yield* passChangeForm({ newPassword });
    }),
});

export default function PassSetupForm() {
  // Get the form context
  const submit = useAtomSet(passSetupForm.submit);

  // Provide feedback to the user regarding this form actions
  useSubmitToast(passSetupForm.submit, "[PASSWORD SETUP]", "Your password has been setup.", undefined, undefined, true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Setup</CardTitle>
        <CardDescription>Setup your password below</CardDescription>
      </CardHeader>
      <CardContent>
        <passSetupForm.Initialize defaultValues={{ newPassword: "", confirmPassword: "" }}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
            }}
          >
            <passSetupForm.newPassword label="New Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
            <br />
            <passSetupForm.confirmPassword label="Confirm Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
            <br />
            <SubmitStatus form={passSetupForm} formName="[PASSWORD SETUP]" succeededDesc="Your password has been setup." />
            <FormSubmit form={passSetupForm} submitIcon={<KeyIcon className="size-9" />} submitText="Setup Password" showCancel={false} />
          </form>
        </passSetupForm.Initialize>
      </CardContent>
    </Card>
  );
}
