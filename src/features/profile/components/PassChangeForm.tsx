"use client";

// services, features, and other libraries
import { Effect } from "effect";
import { useAtomSet } from "@effect-atom/atom-react";
import { FormReact } from "@lucas-barake/effect-form-react";
import { RpcProfileClient } from "@/features/profile/rpc/client";
import { passChangeFormBuilder } from "@/features/profile/schemas";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { PasswordInput } from "@/components/Form/Inputs";
import { FormSubmit, SubmitStatus } from "@/components/Form";

// assets
import { KeyIcon } from "@heroicons/react/24/outline";

const passChangeForm = FormReact.make(passChangeFormBuilder, {
  runtime: RuntimeAtom,
  fields: { currentPassword: PasswordInput, newPassword: PasswordInput, confirmPassword: PasswordInput },
  onSubmit: (_, { decoded: { newPassword, currentPassword } }) =>
    Effect.gen(function* () {
      const { passChangeForm } = yield* RpcProfileClient;
      yield* passChangeForm({ newPassword, currentPassword });
    }),
});

export default function PassChangeForm() {
  // Get the form context
  const submit = useAtomSet(passChangeForm.submit);

  // Provide feedback to the user regarding this form actions
  useSubmitToast(passChangeForm.submit, "[PASSWORD CHANGE]", "Your password has been changed.", undefined, undefined, true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Change</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <passChangeForm.Initialize defaultValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
            }}
          >
            <passChangeForm.currentPassword label="Current Password" size={40} maxLength={129} autoComplete="current-password" placeholder="e.g. P@ssw0rd!" />
            <br />
            <passChangeForm.newPassword label="New Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
            <br />
            <passChangeForm.confirmPassword label="Confirm Password" size={40} maxLength={129} autoComplete="new-password" placeholder="e.g. P@ssw0rd!" />
            <br />
            <SubmitStatus form={passChangeForm} formName="[PASSWORD CHANGE]" succeededDesc="Your password has been changed." />
            <FormSubmit form={passChangeForm} submitIcon={<KeyIcon className="size-9" />} submitText="Change Password" showCancel={false} />
          </form>
        </passChangeForm.Initialize>
      </CardContent>
    </Card>
  );
}
