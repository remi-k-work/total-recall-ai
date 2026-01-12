// react
import { Suspense } from "react";

// next
import { connection } from "next/server";

// drizzle and db access
import { getAvailNoteTags, Note, noteTagIndexesToIds } from "@/features/notes/db";

// services, features, and other libraries
import { Effect } from "effect";
import { RuntimeServer } from "@/lib/RuntimeServer";
import { validatePageInputs } from "@/lib/helpersEffect";
import { NotesPageSchema2 } from "@/features/notes/schemas/notesPage";
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
  // Explicitly defer to request time (Effect uses Date.now() internally)
  await connection();

  // Safely validate next.js route inputs (`params` and `searchParams`) against a schema; return typed data or trigger a 404 on failure
  const {
    searchParams: { str: searchTerm, crp: currentPage, fbt: filterByTagIndxs, sbf: sortByField, sbd: sortByDirection },
  } = await validatePageInputs(NotesPageSchema2, { params, searchParams });

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Retrieve all notes for a user and their available note tags
  const availNoteTags = await getAvailNoteTags(userId);
  const effect = Effect.gen(function* () {
    const note = yield* Note;

    return yield* note.getNotesWithPagination(
      userId,
      searchTerm,
      currentPage,
      6,
      sortByField,
      sortByDirection,
      noteTagIndexesToIds(filterByTagIndxs, availNoteTags),
    );
  });
  const { notes, totalItems, totalPages } = await RuntimeServer.runPromise(effect);

  // const { notes, totalItems, totalPages } = await getNotesWithPagination(
  //   userId,
  //   searchTerm,
  //   currentPage,
  //   6,
  //   sortByField,
  //   sortByDirection,
  //   noteTagIndexesToIds(filterByTagIndxs, availNoteTags),
  // );

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
