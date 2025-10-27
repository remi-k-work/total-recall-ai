// next
import Image from "next/image";

// assets
import logo from "@/assets/logo.jpg";

export default function Logo() {
  return <Image src={logo} alt="Total Recall AI" className="mx-auto h-auto w-full max-w-[1200px] object-contain" />;
}
