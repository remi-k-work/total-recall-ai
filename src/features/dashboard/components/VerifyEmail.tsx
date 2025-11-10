"use client";

// react
import { startTransition, useActionState, useEffect, useRef } from "react";

// server actions and mutations
import verifyEmail from "@/features/dashboard/actions/verifyEmail";

// services, features, and other libraries
import useVerifyEmailFeedback from "@/features/dashboard/hooks/feedbacks/useVerifyEmail";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { Button } from "@/components/ui/custom/button";
import InfoLine from "@/components/form/InfoLine";

// assets
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// types
import type { User } from "@/services/better-auth/auth";

interface VerifyEmailProps {
  user: User;
}

export default function VerifyEmail({ user: { emailVerified } }: VerifyEmailProps) {
  // Triggers the email verification process for the current user
  const [verifyEmailState, verifyEmailAction, verifyEmailsPending] = useActionState(verifyEmail, { actionStatus: "idle" });

  // Track if the user has pressed the submit button
  const hasPressedSubmitRef = useRef(false);

  // All this new cleanup code is for the <Activity /> boundary
  useEffect(() => {
    // Reset the flag when the component unmounts
    return () => {
      hasPressedSubmitRef.current = false;
    };
  }, []);

  // Provide feedback to the user regarding this server action
  const { feedbackMessage, hideFeedbackMessage } = useVerifyEmailFeedback(hasPressedSubmitRef, verifyEmailState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>To access all our features</CardDescription>
      </CardHeader>
      <CardContent>
        {emailVerified ? (
          <InfoLine message="Your email has been verified. Thank you!" className="mx-0 mb-0" />
        ) : (
          <>
            <InfoLine message={feedbackMessage} className="mx-0" />
            <Button
              type="button"
              disabled={verifyEmailsPending}
              className="mx-auto"
              onClick={() => {
                hideFeedbackMessage();
                startTransition(verifyEmailAction);
                hasPressedSubmitRef.current = true;
              }}
            >
              {verifyEmailsPending ? <Loader2 className="size-9 animate-spin" /> : <CheckBadgeIcon className="size-9" />}
              Verify Email
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
