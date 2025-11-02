// react
import { Suspense } from "react";

// services, features, and other libraries
import { makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import PageHeader from "@/components/PageHeader";
import BrowseBar from "@/features/notes/components/browse-bar";
import NewNoteForm from "@/features/notes/components/NewNoteForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► New Note",
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

  return (
    <>
      <PageHeader title="New Note" description="Use the form below to create a new note" />
      <BrowseBar kind="note-new" />
      <NewNoteForm />
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <PageHeader title="New Note" description="Use the form below to create a new note" />
    </>
  );
}
