// react
import { startTransition, useCallback, useMemo } from "react";

// services, features, and other libraries
import { useAtomInitialValues, useAtomSet } from "@effect-atom/atom-react";
import { browseBarAtom, syncToUrlBrowseBarAtom } from ".";
import useUrlScribe from "@/hooks/useUrlScribe";

// types
import type { BrowseBar } from ".";

// constants
import { INIT_BROWSE_BAR } from ".";

// Manages browse bar state, including hydration, zero-read setter actions, and debounced url synchronization
export function useBrowseBar(browseBar: BrowseBar) {
  // Hydrate the master atom on mount
  const incomingBrowseBar = useMemo(() => ({ ...INIT_BROWSE_BAR, ...browseBar }), [browseBar]);
  useAtomInitialValues([[browseBarAtom, incomingBrowseBar]]);

  // Subscriptions and actions
  const syncToUrlBrowseBar = useAtomSet(syncToUrlBrowseBarAtom);

  // A hook to easily create new route strings with updated search parameters (it preserves existing search params)
  const { navigate } = useUrlScribe();

  const setStr = useCallback(
    (str: BrowseBar["str"]) => startTransition(() => syncToUrlBrowseBar(() => ({ update: { str }, navigate }))),
    [syncToUrlBrowseBar, navigate]
  );
  const setCrp = useCallback(
    (crp: BrowseBar["crp"]) => startTransition(() => syncToUrlBrowseBar(() => ({ update: { crp }, navigate }))),
    [syncToUrlBrowseBar, navigate]
  );
  const setFbt = useCallback(
    (fbt: BrowseBar["fbt"]) => startTransition(() => syncToUrlBrowseBar(() => ({ update: { fbt }, navigate }))),
    [syncToUrlBrowseBar, navigate]
  );
  const setSbf = useCallback(
    (sbf: BrowseBar["sbf"]) => startTransition(() => syncToUrlBrowseBar(() => ({ update: { sbf }, navigate }))),
    [syncToUrlBrowseBar, navigate]
  );
  const setSbd = useCallback(
    (sbd: BrowseBar["sbd"]) => startTransition(() => syncToUrlBrowseBar(() => ({ update: { sbd }, navigate }))),
    [syncToUrlBrowseBar, navigate]
  );

  return { setStr, setCrp, setFbt, setSbf, setSbd } as const;
}
