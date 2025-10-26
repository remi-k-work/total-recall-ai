"use client";

// next
import dynamic from "next/dynamic";

// components
const LogoImg = dynamic(() => import("./LogoImg"), { ssr: false });

export default function Logo() {
  return <LogoImg />;
}
