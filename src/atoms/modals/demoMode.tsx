// react
import { useCallback } from "react";

// services, features, and other libraries
import { Option } from "effect";
import { Atom, useAtom, useAtomSet } from "@effect-atom/atom-react";

// components
import DemoModeModal from "@/components/DemoModeModal";

// Create the atom that holds the modal state that is initially 'none' (closed)
const demoModeModalAtom = Atom.make(Option.none<void>());

// This is the hook that components use to open the modal
export function useDemoModeModal() {
  const setDemoModeModal = useAtomSet(demoModeModalAtom);

  const openDemoModeModal = useCallback(() => {
    // Set the atom to some, which will render the modal
    setDemoModeModal(Option.some(undefined));
  }, [setDemoModeModal]);

  return { openDemoModeModal } as const;
}

// The root component that renders the modal based on the atom state
export function DemoModeModalRoot() {
  const [demoModeModal, setDemoModeModal] = useAtom(demoModeModalAtom);

  // Use Effect's pipe and Option.match for a functional render flow
  return demoModeModal.pipe(
    Option.match({
      onNone: () => null,
      onSome: () => <DemoModeModal onClosed={() => setDemoModeModal(Option.none())} />,
    })
  );
}
