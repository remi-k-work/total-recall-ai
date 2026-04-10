"use client";

// react
import { useEffect, useState } from "react";

// services, features, and other libraries
import { useTheme } from "next-themes";
import { useNotePrefs } from "@/atoms";
import Color from "colorjs.io";
import { useEffectDebounce } from "@/hooks/useEffectDebounce";

// types
import type { NoteWithPagination } from "@/features/notes/db";

interface ColorPickerProps {
  note: NoteWithPagination;
}

export default function ColorPicker({ note: { id: noteId, preferences } }: ColorPickerProps) {
  // Determine whether the current theme is dark or light
  const { resolvedTheme } = useTheme();

  // This hook exposes the state of the note preferences store and the actions that are allowed
  const { color: curNoteColor, changedColor } = useNotePrefs(noteId, preferences);

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

  // Use the debounced callback to initiate the relevant actions (user has changed the note color)
  const handleChangedColor = useEffectDebounce((newNoteColor: string) => changedColor(newNoteColor), "1 second");

  return (
    <section className="bg-background p-4">
      <input
        name="colorPicker"
        type="color"
        defaultValue={curNoteColor ?? defNoteColor}
        onChange={({ target: { value: newNoteColor } }) => handleChangedColor(newNoteColor)}
      />
    </section>
  );
}
