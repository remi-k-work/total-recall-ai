// services, features, and other libraries
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { default as notePreferencesStorage } from "./inMemoryStorage";

// types
export interface NotePreferences {
  color: string;
  position: { x: number; y: number };
  isPinned: boolean;
}

export interface NotePreferencesState extends NotePreferences {
  _hasHydrated: boolean;
}

export interface NotePreferencesActions {
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
  const DEFAULT_STATE: NotePreferencesState = { _hasHydrated: false, ...INIT_NOTE_PREFERENCES };

  return createStore<NotePreferencesStore>()(
    persist(
      (set) => ({
        ...DEFAULT_STATE,
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
        storage: createJSONStorage(() => notePreferencesStorage()),

        // Only persist the actual data
        partialize: ({ color, position, isPinned }) => ({ color, position, isPinned }),

        // Safely merge the persisted state with the initial state
        merge: (persistedState, currentState) => {
          const typedState = (persistedState as Partial<NotePreferencesState>) || {};
          return {
            ...currentState,

            // Check for race conditions, and use the current state if the persisted state is invalid
            color: typedState.color ? typedState.color : currentState.color,
            position: typedState.position ? typedState.position : currentState.position,
            isPinned: typedState.isPinned ? typedState.isPinned : currentState.isPinned,
          };
        },

        // The store has been hydrated
        onRehydrateStorage: (state) => () => state._setHasHydrated(),
      },
    ),
  );
};
