// react
import { Suspense } from "react";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { NewNotePageSchema } from "@/features/notes/schemas/newNotePage";
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
export default function Page({ params, searchParams }: PageProps<"/notes/new">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent({ params, searchParams }: PageProps<"/notes/new">) {
  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  const {
    searchParams: { str: searchTerm },
  } = await validatePageInputs(NewNotePageSchema, { params, searchParams });

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  return (
    <>
      <PageHeader title="New Note" description="Use the form below to create a new note" />
      <BrowseBar kind="note-new" searchTerm={searchTerm} />
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
