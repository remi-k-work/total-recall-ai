// services, features, and other libraries
import { DateTime } from "effect";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { UserAvatarLg, UserAvatarLgSkeleton } from "@/components/Avatar/User";

// assets
import { CalendarIcon } from "@heroicons/react/24/outline";

// types
import type { Session, User } from "@/services/better-auth/auth";

interface ProfileInfoProps {
  user: User;
  session: Session;
}

// constants
import { DEMO_USER_EMAIL, DEMO_USER_NAME } from "@/drizzle/seed/constants";

export default function ProfileInfo({ user, user: { email, name, createdAt }, session }: ProfileInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Your account details and current status</CardDescription>
      </CardHeader>
      <CardContent>
        <UserAvatarLg user={user} session={session} />
        <h4 className="mx-auto mt-4 truncate text-center">{name}</h4>
        <p className="mx-auto truncate text-center text-muted-foreground">{email}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-center gap-2 uppercase">
          <CalendarIcon className="size-9" />
          Member Since
        </div>
        <p className="text-center text-muted-foreground">{DateTime.formatLocal(DateTime.unsafeFromDate(createdAt))}</p>
      </CardFooter>
    </Card>
  );
}

export function ProfileInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Your account details and current status</CardDescription>
      </CardHeader>
      <CardContent>
        <UserAvatarLgSkeleton />
        <h4 className="mx-auto mt-4 truncate text-center">{DEMO_USER_NAME}</h4>
        <p className="mx-auto truncate text-center text-muted-foreground">{DEMO_USER_EMAIL}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-center gap-2 uppercase">
          <CalendarIcon className="size-9" />
          Member Since
        </div>
        <p className="text-center text-muted-foreground">&nbsp;</p>
      </CardFooter>
    </Card>
  );
}
