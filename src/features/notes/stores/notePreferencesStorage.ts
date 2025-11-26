// types
import type { StateStorage } from "zustand/middleware";

// We need a factory function because each store instance might talk to a different note id
export const createNotePreferencesStorage = (noteId: string): StateStorage => {
  return {
    getItem: async (): Promise<string | null> => {
      const res = await fetch(`/api/notes/${noteId}/preferences`, { cache: "no-store", credentials: "same-origin", mode: "same-origin" });
      if (!res.ok) throw new Error(res.statusText);
      return (await res.text()) ?? null;
    },

    setItem: async (_: string, value: string): Promise<void> => {
      const res = await fetch(`/api/notes/${noteId}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: value,
        cache: "no-store",
        credentials: "same-origin",
        mode: "same-origin",
      });
      if (!res.ok) throw new Error(res.statusText);
    },

    removeItem: async (): Promise<void> => {
      const res = await fetch(`/api/notes/${noteId}/preferences`, { method: "DELETE", cache: "no-store", credentials: "same-origin", mode: "same-origin" });
      if (!res.ok) throw new Error(res.statusText);
    },
  };
};
