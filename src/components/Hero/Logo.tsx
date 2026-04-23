// next
import Image from "next/image";

// assets
import logo from "@/assets/logo.jpg";

export default function Logo() {
  return <Image src={logo} alt="Total Recall AI" loading="eager" className="h-auto w-full object-contain" />;
}
