// react
import { useCallback } from "react";

// services, features, and other libraries
import { Option } from "effect";
import { Atom, useAtom, useAtomSet } from "@effect-atom/atom-react";

// components
import ConfirmModal from "@/components/ConfirmModal2";

// types
import type { ReactNode } from "react";

interface ConfirmModalState {
  content: ReactNode;
  onConfirmed: () => void;
}

// Create the atom that holds the modal state that is initially 'none' (closed)
const confirmModalAtom = Atom.make(Option.none<ConfirmModalState>());

// This is the hook that components use to open the modal
export function useConfirmModal() {
  const setConfirmModal = useAtomSet(confirmModalAtom);

  const openConfirmModal = useCallback(
    (confirmModalState: ConfirmModalState) => {
      // Set the atom to some, which will render the modal
      setConfirmModal(Option.some(confirmModalState));
    },
    [setConfirmModal]
  );

  return { openConfirmModal } as const;
}

// The root component that renders the modal based on the atom state
export function ConfirmModalRoot() {
  const [confirmModal, setConfirmModal] = useAtom(confirmModalAtom);

  // Use Effect's pipe and Option.match for a functional render flow
  return confirmModal.pipe(
    Option.match({
      onNone: () => null,
      onSome: ({ content, onConfirmed }) => (
        <ConfirmModal onConfirmed={onConfirmed} onClosed={() => setConfirmModal(Option.none())}>
          {content}
        </ConfirmModal>
      ),
    })
  );
}
