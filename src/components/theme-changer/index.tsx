"use client";

// next
import dynamic from "next/dynamic";

// components
import { Button } from "@/components/ui/custom/button";
const Changer = dynamic(() => import("./Changer"), { ssr: false });

// assets
import { SunIcon } from "@heroicons/react/24/outline";

export default function ThemeChanger() {
  return <Changer />;
}

export function ThemeChangerSkeleton() {
  return (
    <Button type="button" size="icon" variant="ghost" title="Change Theme" disabled>
      <SunIcon className="size-11" />
    </Button>
  );
}
