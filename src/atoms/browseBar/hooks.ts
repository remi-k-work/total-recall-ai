// react
import { startTransition, useCallback, useMemo } from "react";

// services, features, and other libraries
import { useAtomInitialValues, useAtomSet } from "@effect-atom/atom-react";
import { browseBarAtom, syncToUrlBrowseBarAtom } from ".";

// types
import type { BrowseBar } from ".";

// constants
import { INIT_BROWSE_BAR } from ".";

// Manages note preferences, including hydration, zero-read setter actions, and debounced database synchronization
export function useBrowseBar(browseBar: BrowseBar) {
  // Hydrate the master atom with server-rendered preferences on mount
  const incomingBrowseBar = useMemo(() => ({ ...INIT_BROWSE_BAR, ...browseBar }), [browseBar]);
  useAtomInitialValues([[browseBarAtom, incomingBrowseBar]]);

  // Setter actions utilizing the optimistic sync and toggle atoms for zero-read updates
  const syncToUrlBrowseBar = useAtomSet(syncToUrlBrowseBarAtom);

  const setStr = useCallback((str: string) => startTransition(() => syncToUrlBrowseBar(() => ({ str }))), [syncToUrlBrowseBar]);

  return { setStr } as const;
}
