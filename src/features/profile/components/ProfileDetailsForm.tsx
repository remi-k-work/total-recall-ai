"use client";

// services, features, and other libraries
import { Effect } from "effect";
import { useAtomSet } from "@effect-atom/atom-react";
import { FormReact } from "@lucas-barake/effect-form-react";
import { RpcProfileClient } from "@/features/profile/rpc/client";
import { profileDetailsFormBuilder } from "@/features/profile/schemas";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { TextInput, TextInputSkeleton } from "@/components/Form/Inputs";
import { FormSubmit, FormSubmitSkeleton, SubmitStatus } from "@/components/Form";
import { UserAvatarMd, UserAvatarMdSkeleton } from "@/components/Avatar/User";
import UploadAvatar, { UploadAvatarSkeleton } from "./UploadAvatar";
import DeleteAvatar, { DeleteAvatarSkeleton } from "./DeleteAvatar";

// assets
import { PencilSquareIcon } from "@heroicons/react/24/outline";

// types
import type { Session, User } from "@/services/better-auth/auth";

interface ProfileDetailsFormProps {
  user: User;
  session: Session;
}

const profileDetailsForm = FormReact.make(profileDetailsFormBuilder, {
  runtime: RuntimeAtom,
  fields: { name: TextInput },
  onSubmit: (_, { decoded: { name } }) =>
    Effect.gen(function* () {
      const { profileDetailsForm } = yield* RpcProfileClient;
      yield* profileDetailsForm({ name });
    }),
});

export default function ProfileDetailsForm({ user, user: { name, image }, session }: ProfileDetailsFormProps) {
  // Get the form context
  const submit = useAtomSet(profileDetailsForm.submit);

  // Provide feedback to the user regarding this form actions
  useSubmitToast(profileDetailsForm.submit, "[PROFILE DETAILS]", "Your profile details have been updated.", undefined, undefined, true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Change your avatar and name</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center justify-around gap-4 sm:justify-between">
          <UserAvatarMd user={user} session={session} />
          <div className="grid gap-4">
            <UploadAvatar />
            <DeleteAvatar currentImage={image ?? undefined} />
          </div>
        </div>
        <profileDetailsForm.Initialize defaultValues={{ name }}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
            }}
          >
            <profileDetailsForm.name label="Name" size={40} maxLength={26} spellCheck={false} autoComplete="name" placeholder="e.g. John Doe" />
            <br />
            <SubmitStatus form={profileDetailsForm} formName="[PROFILE DETAILS]" succeededDesc="Your profile details have been updated." />
            <FormSubmit form={profileDetailsForm} submitIcon={<PencilSquareIcon className="size-9" />} submitText="Change Name" showCancel={false} />
          </form>
        </profileDetailsForm.Initialize>
      </CardContent>
    </Card>
  );
}

export function ProfileDetailsFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Change your avatar and name</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center justify-around gap-4 sm:justify-between">
          <UserAvatarMdSkeleton />
          <div className="grid gap-4">
            <UploadAvatarSkeleton />
            <DeleteAvatarSkeleton />
          </div>
        </div>
        <form>
          <TextInputSkeleton
            formName="[PROFILE DETAILS]"
            label="Name"
            size={40}
            maxLength={26}
            spellCheck={false}
            autoComplete="name"
            placeholder="e.g. John Doe"
          />
          <br />
          <FormSubmitSkeleton submitIcon={<PencilSquareIcon className="size-9" />} submitText="Change Name" showCancel={false} />
        </form>
      </CardContent>
    </Card>
  );
}
