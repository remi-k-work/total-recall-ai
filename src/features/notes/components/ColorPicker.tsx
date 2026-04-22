"use client";

// react
import { useEffect, useState } from "react";

// services, features, and other libraries
import { useTheme } from "next-themes";
import { notePrefsColorAtom, useNotePrefs } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";
import Color from "colorjs.io";

// types
import type { NoteDetails, NoteWithPagination } from "@/features/notes/db";

interface ColorPickerProps {
  note: NoteWithPagination | NoteDetails;
}

export default function ColorPicker({ note, note: { id: noteId } }: ColorPickerProps) {
  // Determine whether the current theme is dark or light
  const { resolvedTheme } = useTheme();

  // Manages note preferences, including hydration, zero-read setter actions, and debounced database synchronization
  const curNoteColor = useAtomValue(notePrefsColorAtom(noteId));
  const { changedColor } = useNotePrefs(note);

  // The default note color should use the fallback value until CSS variables become available
  const [defNoteColor, setDefNoteColor] = useState("#000000");

  // Logic for initial CSS variable extraction
  useEffect(() => {
    requestAnimationFrame(() => {
      // Establish the default note color and normalize it (lab -> srgb)
      const defNoteColorLab = getComputedStyle(document.documentElement).getPropertyValue("--card").trim();
      const defNoteColorRgb = new Color(defNoteColorLab).to("srgb").toString({ format: "hex", collapse: false }).toUpperCase();
      setDefNoteColor(defNoteColorRgb);
    });
  }, [resolvedTheme]);

  return (
    <section className="bg-background p-4">
      <input
        name="colorPicker"
        type="color"
        defaultValue={curNoteColor ?? defNoteColor}
        onChange={({ target: { value: newNoteColor } }) => changedColor(newNoteColor)}
      />
    </section>
  );
}
