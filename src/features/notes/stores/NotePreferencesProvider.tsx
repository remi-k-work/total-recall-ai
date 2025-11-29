/* eslint-disable react-hooks/refs */

"use client";

// react
import { createContext, use, useRef } from "react";

// services, features, and other libraries
import { useStore } from "zustand";
import { createNotePreferencesStore } from "./notePreferences";

// types
import type { ReactNode } from "react";
import type { NotePreferencesStore, NotePreferencesStoreApi, NotePreferencesStored } from "./notePreferences";

interface NotePreferencesProviderProps {
  noteId: string;
  initState?: NotePreferencesStored;
  children: ReactNode;
}

const NotePreferencesStoreContext = createContext<NotePreferencesStoreApi | undefined>(undefined);

export const NotePreferencesStoreProvider = ({ noteId, initState, children }: NotePreferencesProviderProps) => {
  const storeRef = useRef<NotePreferencesStoreApi>(undefined);
  if (!storeRef.current) storeRef.current = createNotePreferencesStore(noteId, initState?.state);

  // Hydration and asynchronous storages - wait until the store has been hydrated before showing anything
  const _hasHydrated = useStore(storeRef.current, (state) => state._hasHydrated);
  if (!_hasHydrated) return null;

  return <NotePreferencesStoreContext value={storeRef.current}>{children}</NotePreferencesStoreContext>;
};

export const useNotePreferencesStore = <T,>(selector: (store: NotePreferencesStore) => T): T => {
  const notePreferencesStoreContext = use(NotePreferencesStoreContext);
  if (!notePreferencesStoreContext) throw new Error("useNotePreferencesStore must be used within a NotePreferencesStoreProvider.");
  return useStore(notePreferencesStoreContext, selector);
};

export const useRehydrateNotePreferences = () => {
  const notePreferencesStoreContext = use(NotePreferencesStoreContext);
  if (!notePreferencesStoreContext) throw new Error("useRehydrateNotePreferences must be used within a NotePreferencesStoreProvider.");
  return notePreferencesStoreContext.persist.rehydrate;
};
