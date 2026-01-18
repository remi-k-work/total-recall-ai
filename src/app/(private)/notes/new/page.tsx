// react
import { Suspense } from "react";

// services, features, and other libraries
import { Effect } from "effect";
import { runPageMainOrNavigate, validatePageInputs } from "@/lib/helpersEffect";
import { NewNotePageSchema } from "@/features/notes/schemas/newNotePage";
import { getUserSessionData } from "@/features/auth/lib/helpersEffect";

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

const main = ({ params, searchParams }: PageProps<"/notes/new">) =>
  Effect.gen(function* () {
    // Safely validate next.js route inputs (`params` and `searchParams`) against a schema; return typed data or trigger a 404 on failure
    const {
      searchParams: { str: searchTerm },
    } = yield* validatePageInputs(NewNotePageSchema, { params, searchParams });

    // Access the user session data from the server side or fail with an unauthorized access error
    yield* getUserSessionData;

    return { searchTerm };
  });

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
  // Execute the main effect for the page, map known errors to the subsequent navigation helpers, and return the payload
  const { searchTerm } = await runPageMainOrNavigate(main({ params, searchParams }));

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
