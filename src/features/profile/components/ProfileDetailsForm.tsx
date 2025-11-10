/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState, useEffect, useRef } from "react";

// server actions and mutations
import profileDetails from "@/features/profile/actions/profileDetailsForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useAppForm } from "@/components/form";
import { ProfileDetailsFormSchema } from "@/features/profile/schemas/profileDetailsForm";
import useProfileDetailsFormFeedback from "@/features/profile/hooks/feedbacks/useProfileDetailsForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import UserAvatar from "@/components/avatar/user";
import UploadAvatar from "./UploadAvatar";
import DeleteAvatar from "./DeleteAvatar";
import InfoLine from "@/components/form/InfoLine";

// assets
import { PencilSquareIcon } from "@heroicons/react/24/outline";

// types
import type { Session, User } from "@/services/better-auth/auth";

interface ProfileDetailsFormProps {
  user: User;
  session: Session;
}

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/profile/constants/profileDetailsForm";

export default function ProfileDetailsForm({ user, user: { name: currentName, image: currentImage }, session }: ProfileDetailsFormProps) {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(profileDetails, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset, store } = useAppForm({
    ...FORM_OPTIONS,
    defaultValues: { ...FORM_OPTIONS.defaultValues, name: currentName },
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
  const { feedbackMessage, hideFeedbackMessage } = useProfileDetailsFormFeedback(hasPressedSubmitRef, formState, reset, store);

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
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Change your avatar and name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap items-center justify-around gap-4 sm:justify-between">
              <UserAvatar user={user} session={session} />
              <div className="grid gap-4">
                <UploadAvatar />
                <DeleteAvatar currentImage={currentImage ?? undefined} />
              </div>
            </div>
            <AppField
              name="name"
              validators={{ onChange: ProfileDetailsFormSchema.shape.name }}
              children={(field) => <field.TextField label="Name" size={40} maxLength={26} spellCheck={false} autoComplete="name" placeholder="e.g. John Doe" />}
            />
          </CardContent>
          <CardFooter>
            <InfoLine message={feedbackMessage} />
            <FormSubmit
              submitIcon={<PencilSquareIcon className="size-9" />}
              submitText="Change Name"
              isPending={isPending}
              showCancel={false}
              onClearedForm={hideFeedbackMessage}
            />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
