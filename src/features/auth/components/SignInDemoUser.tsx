// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import UserAvatar from "@/components/UserAvatar";
import SignInDemo from "./SignInDemo";

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
        <UserAvatar isDemo />
      </CardContent>
      <CardFooter>
        <SignInDemo redirect={redirect} />
      </CardFooter>
    </Card>
  );
}
