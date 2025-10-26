// next
import Link from "next/link";
import Image from "next/image";

// services, features, and other libraries
import { useTheme } from "next-themes";

// assets
import logoD from "@/assets/logo.png";
import logoL from "@/assets/logo.webp";

export default function LogoImg() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <Link href="/" title="Total Recall AI" className="flex-none">
      <Image src={isDarkMode ? logoD : logoL} alt="Total Recall AI" className="h-24 w-auto object-contain" />
    </Link>
  );
}
