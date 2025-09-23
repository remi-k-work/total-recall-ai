/* eslint-disable react/no-children-prop */

"use client";

// react
import { useActionState } from "react";

// server actions and mutations
import profileDetails from "@/features/profile/actions/profileDetailsForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useAppForm } from "@/components/form";
import { ProfileDetailsFormSchema } from "@/features/profile/schemas/profileDetailsForm";
import useProfileDetailsFormFeedback from "@/features/profile/hooks/feedbacks/useProfileDetailsForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import UserAvatar from "@/components/UserAvatar";
import UploadAvatar from "./UploadAvatar";
import DeleteAvatar from "./DeleteAvatar";

// assets
import { PencilSquareIcon } from "@heroicons/react/24/outline";

// types
interface ProfileDetailsFormProps {
  currentName: string;
  currentImage?: string;
}

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/profile/constants/profileDetailsForm";

export default function ProfileDetailsForm({ currentName, currentImage }: ProfileDetailsFormProps) {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(profileDetails, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset, store } = useAppForm({
    ...FORM_OPTIONS,
    defaultValues: { ...FORM_OPTIONS.defaultValues, name: currentName },
    transform: useTransform((baseForm) => mergeForm(baseForm, formState), [formState]),
  });

  // Provide feedback to the user regarding this form actions
  const { feedbackMessage, clearFeedbackMessage } = useProfileDetailsFormFeedback(formState, reset, store);

  return (
    <AppForm>
      <form action={formAction} onSubmit={() => handleSubmit()}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Change your avatar and name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap items-center justify-around gap-4 sm:justify-between">
              <UserAvatar name={currentName} avatar={currentImage} />
              <div className="grid gap-4">
                <UploadAvatar />
                <DeleteAvatar currentImage={currentImage} />
              </div>
            </div>
            <AppField
              name="name"
              validators={{ onChange: ProfileDetailsFormSchema.shape.name }}
              children={(field) => <field.TextField label="Name" size={40} maxLength={26} spellCheck={false} autoComplete="name" placeholder="e.g. John Doe" />}
            />
          </CardContent>
          <CardFooter>
            {feedbackMessage && (
              <p role="status" aria-live="polite" className="text-muted-foreground">
                {feedbackMessage}
              </p>
            )}
            <FormSubmit
              submitIcon={<PencilSquareIcon className="size-9" />}
              submitText="Change Name"
              isPending={isPending}
              showCancel={false}
              onClearedForm={clearFeedbackMessage}
            />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
