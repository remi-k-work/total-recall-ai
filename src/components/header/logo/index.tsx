"use client";

// next
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

// assets
import logoD from "@/assets/logo.png";

export const Logo = dynamic(() => import("./Logo"), { ssr: false });

export function LogoSkeleton() {
  return (
    <Link href="/" title="Total Recall AI" className="flex-none">
      <Image src={logoD} alt="Total Recall AI" className="h-24 w-auto object-contain" />
    </Link>
  );
}
