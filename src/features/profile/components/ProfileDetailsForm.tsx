/* eslint-disable react/no-children-prop */

"use client";

// react
import { startTransition, useActionState } from "react";

// next
import { useRouter } from "next/navigation";

// server actions and mutations
import profileDetails from "@/features/profile/actions/profileDetailsForm";
import deleteAvatar from "@/features/profile/actions/deleteAvatar";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useAppForm } from "@/components/form";
import { ProfileDetailsFormSchema } from "@/features/profile/schemas/profileDetailsForm";
import useProfileDetailsFormFeedback from "@/features/profile/hooks/feedbacks/useProfileDetailsForm";
import { authClient } from "@/services/better-auth/auth-client";

// components
import { Button } from "@/components/ui/custom/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import UserAvatar from "@/components/UserAvatar";
import { UploadButton } from "@/services/uploadthing/components";
import { toast } from "sonner";

// assets
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// types
interface ProfileDetailsFormProps {
  currentName: string;
  currentImage?: string;
}

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/profile/constants/profileDetailsForm";

export default function ProfileDetailsForm({ currentName, currentImage }: ProfileDetailsFormProps) {
  const [formState, formAction, isPending] = useActionState(profileDetails, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, reset } = useAppForm({
    ...FORM_OPTIONS,
    defaultValues: { ...FORM_OPTIONS.defaultValues, name: currentName },
    transform: useTransform((baseForm) => mergeForm(baseForm, formState), [formState]),
  });

  const [deleteAvatarState, deleteAvatarAction, deleteAvatarIsPending] = useActionState(deleteAvatar, { actionStatus: "idle" });

  // Provide feedback to the user regarding this form actions
  useProfileDetailsFormFeedback(formState, reset);

  // To be able to refresh the page
  const router = useRouter();

  return (
    <AppForm>
      <form action={formAction} onSubmit={() => handleSubmit()}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Change your avatar and name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between gap-4">
              <UserAvatar name={currentName} avatar={currentImage} />
              <div className="grid gap-4">
                <UploadButton
                  endpoint="avatarUploader"
                  onClientUploadComplete={async (res) => {
                    res.forEach(async ({ ufsUrl, serverData: { message } }) => {
                      // Update a user's image that should point to their avatar's url
                      await authClient.updateUser({ image: ufsUrl });

                      // Display a success message
                      toast.success("SUCCESS!", { description: message });

                      // Refresh the page
                      router.refresh();
                    });
                  }}
                  onUploadError={(error: Error) => {
                    // Show the upload error message in case something goes wrong
                    toast.error("UPLOAD ERROR!", { description: error.message });
                  }}
                  className="ut-button:w-full ut-button:rounded-none ut-button:uppercase ut-button:font-semibold ut-button:tracking-widest ut-button:bg-primary ut-button:text-primary-foreground"
                />
                <Button type="button" variant="destructive" disabled={deleteAvatarIsPending} onClick={() => startTransition(deleteAvatarAction)}>
                  {deleteAvatarIsPending ? <Loader2 className="size-9 animate-spin" /> : <TrashIcon className="size-9" />}
                  Delete Avatar
                </Button>
              </div>
            </div>
            <AppField
              name="name"
              validators={{ onChange: ProfileDetailsFormSchema.shape.name }}
              children={(field) => <field.TextField label="Name" size={40} maxLength={26} spellCheck={false} autoComplete="name" placeholder="e.g. John Doe" />}
            />
          </CardContent>
          <CardFooter>
            <FormSubmit submitIcon={<PencilSquareIcon className="size-9" />} submitText="Change Name" isPending={isPending} showCancel={false} />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
