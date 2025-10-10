"use client";

// react
import { startTransition, useActionState, useState } from "react";

// server actions and mutations
import signOutEverywhere from "@/features/profile/actions/signOutEverywhere";

// services, features, and other libraries
import useSignOutEverywhereFeedback from "@/features/profile/hooks/feedbacks/useSignOutEverywhere";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { Button } from "@/components/ui/custom/button";
import ConfirmModal from "@/components/ConfirmModal";

// assets
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

export default function SignOutEverywhere() {
  // Signs the user out from all devices
  const [signOutEverywhereState, signOutEverywhereAction, signOutEverywhereIsPending] = useActionState(signOutEverywhere, { actionStatus: "idle" });

  // Provide feedback to the user regarding this server action
  useSignOutEverywhereFeedback(signOutEverywhereState);

  // Whether or not the confirm modal is open
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sign Out Everywhere</CardTitle>
          <CardDescription>Sign out from all devices</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="destructive" disabled={signOutEverywhereIsPending} onClick={() => setIsOpen(true)} className="mx-auto">
            {signOutEverywhereIsPending ? <Loader2 className="size-9 animate-spin" /> : <ArrowRightStartOnRectangleIcon className="size-9" />}
            Sign Out Everywhere
          </Button>
        </CardContent>
      </Card>
      {isOpen && (
        <ConfirmModal onConfirmed={() => startTransition(signOutEverywhereAction)} onClosed={() => setIsOpen(false)}>
          <p className="text-center text-xl">
            Are you sure you want to <b className="text-destructive">sign out</b> from all devices?
          </p>
        </ConfirmModal>
      )}
    </>
  );
}
