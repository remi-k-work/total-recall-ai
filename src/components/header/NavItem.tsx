"use client";

// next
import { usePathname } from "next/navigation";
import Link from "next/link";

// services, features, and other libraries
import { cn } from "@/lib/utils";

// types
import type { Route } from "next";
import type { ReactNode } from "react";

interface NavItemProps {
  href: Route;
  match: string;
  title: string;
  icon: ReactNode;
  isExternal?: boolean;
}

export default function NavItem({ href, match, title, icon, isExternal = false }: NavItemProps) {
  const pathname = usePathname();

  // Compile regex client-side
  const regex = new RegExp(match);
  const isActive = regex.test(pathname);

  return (
    <Link
      href={href}
      title={title}
      prefetch={!isExternal}
      target={isExternal ? "_blank" : undefined}
      className={cn(
        "bg-secondary border p-3",
        "[&>svg]:size-11",
        isActive ? "border-accent transition-colors [&>svg]:size-13" : "hover:border-accent hover:scale-110",
      )}
    >
      {icon}
    </Link>
  );
}
