// next
import Link from "next/link";
import Image from "next/image";

// assets
import logo from "@/assets/logo.webp";

export default function Logo() {
  return (
    <Link href="/" title="Total Recall AI" className="flex-none">
      <Image src={logo} alt="Total Recall AI" className="h-24 w-auto object-contain" />
    </Link>
  );
}
