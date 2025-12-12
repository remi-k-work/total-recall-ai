// react
import { Suspense } from "react";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { NewNotePageSchema } from "@/features/notes/schemas/newNotePage";
import { makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import NewNoteForm from "@/features/notes/components/NewNoteForm";

// assets
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

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
    <NoteModal icon={<DocumentPlusIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="note-new" searchTerm={searchTerm} />}>
      <NewNoteForm inNoteModal />
    </NoteModal>
  );
}

function PageSkeleton() {
  return null;
}
