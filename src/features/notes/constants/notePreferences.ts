// types
import type { NotePreferences } from "@/features/notes/stores/notePreferences";

// The initial fallback for note preferences
export const INIT_NOTE_PREFERENCES: NotePreferences = { color: "", position: { x: 0, y: 0 }, isPinned: false } as const;
