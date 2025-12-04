// react
import { Suspense } from "react";

// drizzle and db access
import { getAllNoteTags } from "@/features/notes/db";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import PageHeader from "@/components/PageHeader";
import EditAvialNoteTagsForm from "@/features/notes/components/EditAvailNoteTagsForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Edit Available Note Tags",
};

// Page remains the fast, static shell
export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent() {
  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Retrieve all note tags for a specific user ordered alphabetically (useful for the tag management list or autocomplete)
  const noteTags = await getAllNoteTags(userId);

  return (
    <>
      <PageHeader title="Edit Available Note Tags" description="Use the form below to edit all your available note tags" />
      <EditAvialNoteTagsForm noteTags={noteTags} />
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <PageHeader title="Edit Available Note Tags" description="Use the form below to edit all your available note tags" />
    </>
  );
}
