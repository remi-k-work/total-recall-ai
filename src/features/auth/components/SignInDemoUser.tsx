// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import DemoAvatar, { DemoAvatarSkeleton } from "@/components/Avatar/Demo";
import SignInDemo, { SignInDemoSkeleton } from "./SignInDemo";

// types
import type { Route } from "next";

interface SignInDemoUserProps {
  redirect?: Route;
}

export default function SignInDemoUser({ redirect }: SignInDemoUserProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In as a Demo User</CardTitle>
        <CardDescription>To test drive the application</CardDescription>
      </CardHeader>
      <CardContent>
        <DemoAvatar />
      </CardContent>
      <CardFooter>
        <SignInDemo redirect={redirect} />
      </CardFooter>
    </Card>
  );
}

export function SignInDemoUserSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In as a Demo User</CardTitle>
        <CardDescription>To test drive the application</CardDescription>
      </CardHeader>
      <CardContent>
        <DemoAvatarSkeleton />
      </CardContent>
      <CardFooter>
        <SignInDemoSkeleton />
      </CardFooter>
    </Card>
  );
}
