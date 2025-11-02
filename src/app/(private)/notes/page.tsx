// react
import { Suspense } from "react";

// drizzle and db access
import { getNotesWithPagination } from "@/features/notes/db";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { NotesPageSchema } from "@/features/notes/schemas/notesPage";
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import PageHeader from "@/components/PageHeader";
import BrowseBar from "@/features/notes/components/browse-bar";
import NotesPreview from "@/features/notes/components/NotesPreview";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Notes",
};

// Page remains the fast, static shell
export default function Page({ params, searchParams }: PageProps<"/notes">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent({ params, searchParams }: PageProps<"/notes">) {
  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  const {
    searchParams: { str: searchTerm, crp: currentPage, sbf: sortByField, sbd: sortByDirection },
  } = await validatePageInputs(NotesPageSchema, { params, searchParams });

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Retrieve all notes for a user, including only the essential fields, and shorten the content for preview purposes
  const { notes, totalItems, totalPages } = await getNotesWithPagination(userId, searchTerm, currentPage, 6, sortByField, sortByDirection);

  return (
    <>
      <PageHeader title="Notes" description="Welcome back! Below are all your notes" />
      <BrowseBar
        kind="notes-root"
        totalItems={totalItems}
        totalPages={totalPages}
        searchTerm={searchTerm}
        sortByField={sortByField}
        sortByDirection={sortByDirection}
        currentPage={currentPage}
      />
      <NotesPreview notes={notes} />
      <BrowseBar
        kind="notes-root"
        totalItems={totalItems}
        totalPages={totalPages}
        searchTerm={searchTerm}
        sortByField={sortByField}
        sortByDirection={sortByDirection}
        currentPage={currentPage}
      />
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <PageHeader title="Notes" description="Welcome back! Below are all your notes" />
    </>
  );
}
