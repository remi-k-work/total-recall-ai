// types
import type { StateStorage } from "zustand/middleware";

// We need a factory function because each store instance might talk to a different note id
export const createNotePreferencesStorage = (noteId: string): StateStorage => {
  // If we are on the server, return a "dummy" storage that does nothing; this prevents the "Invalid URL" error because fetch is never called
  if (typeof window === "undefined") {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }

  // Client-side logic
  const NOTES_API = `/api/notes/${noteId}/preferences`;

  return {
    getItem: async (): Promise<string | null> => {
      const res = await fetch(NOTES_API, { cache: "no-store", credentials: "same-origin", mode: "same-origin" });
      if (!res.ok) throw new Error(res.statusText);
      return (await res.text()) ?? null;
    },

    setItem: async (_: string, value: string): Promise<void> => {
      const res = await fetch(NOTES_API, {
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
      const res = await fetch(NOTES_API, {
        method: "DELETE",
        cache: "no-store",
        credentials: "same-origin",
        mode: "same-origin",
      });
      if (!res.ok) throw new Error(res.statusText);
    },
  };
};
