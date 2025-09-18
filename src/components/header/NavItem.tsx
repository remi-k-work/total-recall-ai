"use client";

// next
import { usePathname } from "next/navigation";
import Link from "next/link";

// services, features, and other libraries
import { cn } from "@/lib/utils";

// types
import type { ReactNode } from "react";

interface NavItemProps {
  href: __next_route_internal_types__.RouteImpl<string>;
  title: string;
  icon: ReactNode;
  isExternal?: boolean;
}

export default function NavItem({ href, title, icon, isExternal = false }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Link
      href={href}
      title={title}
      prefetch={!isExternal}
      target={isExternal ? "_blank" : undefined}
      className={cn(
        "[&>svg]:size-11",
        isActive
          ? "border-foreground [&>svg]:text-foreground transition-colors [&>svg]:size-13"
          : "border-primary-foreground hover:border-accent-foreground hover:scale-110",
      )}
    >
      {icon}
    </Link>
  );
}
