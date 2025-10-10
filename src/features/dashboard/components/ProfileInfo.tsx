// services, features, and other libraries
import { format } from "date-fns";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import UserAvatar from "@/components/UserAvatar";

// assets
import { CalendarIcon } from "@heroicons/react/24/outline";

// types
import type { User } from "@/services/better-auth/auth";

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user: { email, name, image, createdAt } }: ProfileInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Your account details and current status</CardDescription>
      </CardHeader>
      <CardContent>
        <UserAvatar name={name} avatar={image ?? undefined} className="mx-auto" />
        <h4 className="mx-auto mt-4 truncate text-center">{name}</h4>
        <p className="text-muted-foreground mx-auto truncate text-center">{email}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-center gap-2 uppercase">
          <CalendarIcon className="size-9" />
          Member Since
        </div>
        <p className="text-muted-foreground text-center">{format(createdAt, "MMMM d, yyyy")}</p>
      </CardFooter>
    </Card>
  );
}
