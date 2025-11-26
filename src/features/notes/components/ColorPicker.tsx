"use client";

// react
import { useEffect, useState } from "react";

// services, features, and other libraries
import { useTheme } from "next-themes";
import { useNotePreferencesStore } from "@/features/notes/stores/NotePreferencesProvider";
import Color from "colorjs.io";
import { useDebouncedCallback } from "use-debounce";

export default function ColorPicker() {
  // Determine whether the current theme is dark or light
  const { resolvedTheme } = useTheme();

  // Retrieve the necessary state and actions from the note preferences store
  const curNoteColor = useNotePreferencesStore((state) => state.color);
  const changedColor = useNotePreferencesStore((state) => state.changedColor);

  // The default note color should use the fallback value until CSS variables become available
  const [defNoteColor, setDefNoteColor] = useState("#000000");

  useEffect(() => {
    requestAnimationFrame(() => {
      // Establish the default note color and normalize it (lab -> srgb)
      const defNoteColorLab = getComputedStyle(document.documentElement).getPropertyValue("--card").trim();
      const defNoteColorRgb = new Color(defNoteColorLab).to("srgb").toString({ format: "hex", collapse: false }).toUpperCase();
      setDefNoteColor(defNoteColorRgb);
    });
  }, [resolvedTheme]);

  // Use the debounced callback to initiate the relevant actions
  const handleChangedColor = useDebouncedCallback((newNoteColor: string) => {
    // User has changed the note color
    console.log("handleChangedColor", newNoteColor);
    changedColor(newNoteColor);
  }, 1000);

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
