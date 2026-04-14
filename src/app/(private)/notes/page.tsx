// react
import { Suspense } from "react";

// drizzle and db access
import { NoteDB, NoteTagDB } from "@/features/notes/db";

// services, features, and other libraries
import { Effect } from "effect";
import { runPageMainOrNavigate, validatePageInputs } from "@/lib/helpersEffect";
import { NotesPageSchema } from "@/features/notes/schemas/notesPage";
import { getUserSessionData } from "@/features/auth/lib/helpersEffect";

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

const main = ({ params, searchParams }: PageProps<"/notes">) =>
  Effect.gen(function* () {
    // Safely validate next.js route inputs (`params` and `searchParams`) against a schema; return typed data or trigger a 404 on failure
    const {
      searchParams: { str: searchTerm, crp: currentPage, fbt: filterByTagIndxs, sbf: sortByField, sbd: sortByDirection },
    } = yield* validatePageInputs(NotesPageSchema, { params, searchParams });

    // Access the user session data from the server side or fail with an unauthorized access error
    const {
      user: { id: userId },
    } = yield* getUserSessionData;

    const noteDB = yield* NoteDB;
    const noteTagDB = yield* NoteTagDB;

    // Retrieve all note tags for a specific user ordered alphabetically (useful for the tag management list or autocomplete)
    const availNoteTags = yield* noteTagDB.getAvailNoteTags(userId);

    // Map URL-provided note tag indexes to their corresponding note tag IDs using the ordered list of all available note tags for this user
    const filterByTagIds = yield* noteTagDB.noteTagIndexesToIds(filterByTagIndxs, availNoteTags);

    // Retrieve all notes for a user, including only the essential fields, and shorten the content for preview purposes
    const { notes, totalItems, totalPages } = yield* noteDB.getNotesWithPagination(
      userId,
      searchTerm,
      currentPage,
      6,
      sortByField,
      sortByDirection,
      filterByTagIds,
    );

    return { searchTerm, currentPage, filterByTagIndxs, sortByField, sortByDirection, notes, totalItems, totalPages, availNoteTags };
  });

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
  // Execute the main effect for the page, map known errors to the subsequent navigation helpers, and return the payload
  const { searchTerm, currentPage, filterByTagIndxs, sortByField, sortByDirection, notes, totalItems, totalPages, availNoteTags } = await runPageMainOrNavigate(
    main({ params, searchParams }),
  );

  return (
    <>
      <PageHeader title="Notes" description="Welcome back! Below are all your notes" />
      <BrowseBar
        kind="notes-root"
        totalItems={totalItems}
        totalPages={totalPages}
        searchTerm={searchTerm}
        availNoteTags={availNoteTags}
        filterByTagIndxs={filterByTagIndxs}
        sortByField={sortByField}
        sortByDirection={sortByDirection}
        currentPage={currentPage}
      />
      <NotesPreview notes={notes} availNoteTags={availNoteTags} />
      <BrowseBar
        kind="notes-root"
        totalItems={totalItems}
        totalPages={totalPages}
        searchTerm={searchTerm}
        availNoteTags={availNoteTags}
        filterByTagIndxs={filterByTagIndxs}
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
