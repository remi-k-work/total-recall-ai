"use client";

// next
import dynamic from "next/dynamic";

// components
const Changer = dynamic(() => import("./Changer"), { ssr: false });

export default function ThemeChanger() {
  return <Changer />;
}
