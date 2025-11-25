// types
import type { NotePreferences } from "@/features/notes/stores/notePreferences";

// The initial fallback for note preferences
export const INIT_NOTE_PREFERENCES: NotePreferences = { color: undefined, position: undefined, isPinned: false } as const;
