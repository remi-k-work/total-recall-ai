"use client";

// next
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

// components
const LogoImg = dynamic(() => import("./LogoImg"), { ssr: false });

// assets
import logoD from "@/assets/logo.png";

export default function Logo() {
  return <LogoImg />;
}

export function LogoSkeleton() {
  return (
    <Link href="/" title="Total Recall AI" className="flex-none">
      <Image src={logoD} alt="Total Recall AI" className="h-24 w-auto object-contain" />
    </Link>
  );
}
