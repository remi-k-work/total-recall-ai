// react
import { useCallback } from "react";

// services, features, and other libraries
import { Option } from "effect";
import { Atom, useAtom, useAtomSet } from "@effect-atom/atom-react";

// components
import NotesAssistantModal from "@/features/notesAssistant/components/NotesAssistantModal";

// types
import type { Session, User } from "@/services/better-auth/auth";

interface NotesAssistantModalRootProps {
  user: User;
  session: Session;
}

// Create the atom that holds the modal state that is initially 'none' (closed)
const notesAssistantModalAtom = Atom.make(Option.none<void>());

// This is the hook that components use to open the modal
export function useNotesAssistantModal() {
  const setNotesAssistantModal = useAtomSet(notesAssistantModalAtom);

  const openNotesAssistantModal = useCallback(() => {
    // Set the atom to some, which will render the modal
    setNotesAssistantModal(Option.some(undefined));
  }, [setNotesAssistantModal]);

  return { openNotesAssistantModal } as const;
}

// The root component that renders the modal based on the atom state
export function NotesAssistantModalRoot({ user, session }: NotesAssistantModalRootProps) {
  const [notesAssistantModal, setNotesAssistantModal] = useAtom(notesAssistantModalAtom);

  // Use Effect's pipe and Option.match for a functional render flow
  return notesAssistantModal.pipe(
    Option.match({
      onNone: () => null,
      onSome: () => <NotesAssistantModal user={user} session={session} onClosed={() => setNotesAssistantModal(Option.none())} />,
    })
  );
}
