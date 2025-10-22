// react
import { startTransition, useActionState, useState } from "react";

// server actions and mutations
import deleteNote from "@/features/notes/actions/deleteNote";

// services, features, and other libraries
import { useBrowseBarContext } from "./context";
import useDeleteNoteFeedback from "@/features/notes/hooks/feedbacks/useDeleteNote";

// components
import { Button } from "@/components/ui/custom/button";
import ConfirmModal from "@/components/ConfirmModal";

// assets
import { TrashIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// types
import type { DeleteNoteActionResult } from "@/features/notes/actions/deleteNote";

export default function DeleteNote() {
  // Access the browse bar context and retrieve all necessary information
  const { noteId } = useBrowseBarContext("note-details");

  // This action deletes a user's note along with all associated note chunks
  const [deleteNoteState, deleteNoteAction, deleteNoteIsPending] = useActionState(deleteNote.bind(null, noteId), {
    actionStatus: "idle" as DeleteNoteActionResult["actionStatus"],
  });

  // Provide feedback to the user regarding this server action
  useDeleteNoteFeedback(deleteNoteState);

  // Whether or not the confirm modal is open
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="destructive" className="flex-col whitespace-pre-line" disabled={deleteNoteIsPending} onClick={() => setIsOpen(true)}>
        {deleteNoteIsPending ? <Loader2 className="size-11 animate-spin" /> : <TrashIcon className="size-11" />}
        {"Delete Note".replaceAll(" ", "\n")}
      </Button>
      {isOpen && (
        <ConfirmModal onConfirmed={() => startTransition(deleteNoteAction)} onClosed={() => setIsOpen(false)}>
          <p className="text-center text-xl">
            Are you sure you want to <b className="text-destructive">delete</b> this note?
          </p>
        </ConfirmModal>
      )}
    </>
  );
}
