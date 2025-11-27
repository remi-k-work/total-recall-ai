// services, features, and other libraries
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { createNotePreferencesStorage } from "./notePreferencesStorage";

// types
// The core data shape
export interface NotePreferences {
  color?: string;
  position?: { x: number; y: number };
  isPinned: boolean;
}

// The db shape (matches what drizzle expects)
export interface NotePreferencesStored {
  state: NotePreferences;
  version: number;
}

interface NotePreferencesState extends NotePreferences {
  _hasHydrated: boolean;
}

interface NotePreferencesActions {
  _setHasHydrated: () => void;

  changedColor: (color: string) => void;
  changedPosition: (x: number, y: number) => void;
  toggledPin: () => void;
}

export type NotePreferencesStore = NotePreferencesState & NotePreferencesActions;
export type NotePreferencesStoreApi = ReturnType<typeof createNotePreferencesStore>;

// constants
import { INIT_NOTE_PREFERENCES } from "@/features/notes/constants/notePreferences";

export const createNotePreferencesStore = (noteId: string, initState?: NotePreferences) => {
  return createStore<NotePreferencesStore>()(
    persist(
      (set) => ({
        _hasHydrated: false,

        ...INIT_NOTE_PREFERENCES,
        ...initState,

        // The store has been hydrated
        _setHasHydrated: () => set(() => ({ _hasHydrated: true })),

        // User has changed the note color
        changedColor: (color) => set(() => ({ color })),

        // User has changed the note position
        changedPosition: (x, y) => set(() => ({ position: { x, y } })),

        // User has toggled the note pin
        toggledPin: () => set((state) => ({ isPinned: !state.isPinned })),
      }),
      {
        name: `notePreferences-${noteId}`,
        version: 1,
        storage: createJSONStorage(() => createNotePreferencesStorage(noteId)),

        // Only persist the actual data
        partialize: ({ color, position, isPinned }) => ({ color, position, isPinned }),

        // Safely merge the persisted state with the initial state
        merge: (persisted, current) => {
          const incoming = (persisted as Partial<NotePreferencesState>) || {};
          return {
            ...current,

            // Check for race conditions, and use the current state if the persisted state is invalid
            color: incoming.color ?? current.color,
            position: incoming.position ?? current.position,
            isPinned: incoming.isPinned ?? current.isPinned,
          };
        },

        // The store has been hydrated
        onRehydrateStorage: (state) => () => state._setHasHydrated(),
      },
    ),
  );
};
