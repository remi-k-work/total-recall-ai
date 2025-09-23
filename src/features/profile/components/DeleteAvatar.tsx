// react
import { startTransition, useActionState } from "react";

// server actions and mutations
import deleteAvatar from "@/features/profile/actions/deleteAvatar";

// services, features, and other libraries
import useDeleteAvatarFeedback from "@/features/profile/hooks/feedbacks/useDeleteAvatar";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { TrashIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// types
interface DeleteAvatarProps {
  currentImage?: string;
}

export default function DeleteAvatar({ currentImage }: DeleteAvatarProps) {
  // Deletes a user avatar, sets the user's image to null, and removes the corresponding avatar file from uploadthing
  const [deleteAvatarState, deleteAvatarAction, deleteAvatarIsPending] = useActionState(deleteAvatar, { actionStatus: "idle" });

  // Provide feedback to the user regarding this server action
  useDeleteAvatarFeedback(deleteAvatarState);

  return (
    <Button type="button" variant="destructive" disabled={!currentImage || deleteAvatarIsPending} onClick={() => startTransition(deleteAvatarAction)}>
      {deleteAvatarIsPending ? <Loader2 className="size-9 animate-spin" /> : <TrashIcon className="size-9" />}
      Delete Avatar
    </Button>
  );
}
