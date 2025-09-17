// next
import Link from "next/link";
import Image from "next/image";

// other libraries
import { getUserSessionData } from "@/features/auth/lib/helpers";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/custom/button";
import SignOut from "./SignOut";

// assets
import { UserIcon } from "@heroicons/react/24/outline";

export default async function UserPopover() {
  // Access the user session data from the server side
  const userSessionData = await getUserSessionData();

  // If there is no user session data, do not render anything
  if (!userSessionData) return null;

  // Destructure the user session data
  const {
    user: { email, name, image },
  } = userSessionData;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="icon">
          {image ? <Image src={image} alt={name} width={44} height={44} className="rounded-full object-cover" /> : <UserIcon className="size-11" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-4">
        <h3>{name}</h3>
        <p>{email}</p>
        <Button variant="ghost" asChild>
          <Link href="/profile">
            <UserIcon className="size-9" />
            Profile
          </Link>
        </Button>
        <SignOut />
      </PopoverContent>
    </Popover>
  );
}
