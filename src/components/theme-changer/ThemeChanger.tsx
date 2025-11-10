// services, features, and other libraries
import { useTheme } from "next-themes";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeChanger() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <Button type="button" size="icon" variant="ghost" title={isDarkMode ? "Light Mode" : "Dark Mode"} onClick={() => setTheme(isDarkMode ? "light" : "dark")}>
      {isDarkMode ? <SunIcon className="size-11" /> : <MoonIcon className="size-11" />}
    </Button>
  );
}
