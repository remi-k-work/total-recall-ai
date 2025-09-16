"use client";

// react
import { useEffect, useState } from "react";

// other libraries
import { useTheme } from "next-themes";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeChanger() {
  // const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // if (!isMounted) return null;

  return (
    <Button type="button" size="icon" variant="ghost" title="Change Theme" onClick={() => setTheme(isDarkMode ? "light" : "dark")}>
      {isDarkMode ? <SunIcon className="size-11" /> : <MoonIcon className="size-11" />}
    </Button>
  );
}
