"use client";

// services, features, and other libraries
import { useNotePreferencesStore } from "@/features/notes/stores/NotePreferencesProvider";

export default function ColorPicker() {
  // Retrieve the necessary state and actions from the note preferences store
  const color = useNotePreferencesStore((state) => state.color);
  const changedColor = useNotePreferencesStore((state) => state.changedColor);

  return (
    <section className="bg-background rounded-lg p-3">
      <input name="colorPicker" type="color" value={color} onChange={(ev) => changedColor(ev.target.value)} />
    </section>
  );
}
