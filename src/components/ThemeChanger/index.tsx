"use client";

// next
import dynamic from "next/dynamic";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { SunIcon } from "@heroicons/react/24/outline";

export const ThemeChanger = dynamic(() => import("./ThemeChanger"), { ssr: false });

export function ThemeChangerSkeleton() {
  return (
    <Button type="button" size="icon" variant="ghost" title="Change Theme" disabled>
      <SunIcon className="size-11" />
    </Button>
  );
}
