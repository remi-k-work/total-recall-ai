// services, features, and other libraries
import { Effect } from "effect";
import { useAtom } from "@effect-atom/atom-react";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { useSubmitToast } from "@/components/Form/hooks";
import { RpcNotesClient } from "@/features/notes/rpc/client";
import { useConfirmModal } from "@/atoms";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { TrashIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// types
interface DeleteNoteProps {
  noteId: string;
}

const deleteNoteActionAtom = RuntimeAtom.fn(
  Effect.fnUntraced(function* (noteId: string) {
    const { deleteNote } = yield* RpcNotesClient;
    yield* deleteNote({ noteId });
  })
);

export default function DeleteNote({ noteId }: DeleteNoteProps) {
  // This is the hook that components use to open the modal
  const { openConfirmModal } = useConfirmModal();

  // This action deletes a user's note along with all associated note chunks
  const [deleteNoteResult, deleteNoteAction] = useAtom(deleteNoteActionAtom);

  // Provide feedback to the user regarding this server action
  useSubmitToast(
    deleteNoteActionAtom,
    "[DELETE NOTE]",
    "Your note has been deleted.",
    "Your note could not be deleted; please try again later.",
    "/notes",
    true
  );

  return (
    <Button
      type="button"
      variant="destructive"
      className="flex-col whitespace-pre-line"
      disabled={deleteNoteResult.waiting}
      onClick={() => {
        openConfirmModal({
          content: (
            <p className="text-center text-xl">
              Are you sure you want to <b className="text-destructive">delete</b> this note?
            </p>
          ),
          onConfirmed: () => {
            deleteNoteAction(noteId);
          },
        });
      }}
    >
      {deleteNoteResult.waiting ? <Loader2 className="size-11 animate-spin" /> : <TrashIcon className="size-11" />}
      {"Delete Note".replaceAll(" ", "\n")}
    </Button>
  );
}
