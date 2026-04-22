// react
import { Suspense } from "react";

// drizzle and db access
import { NoteDB, NoteTagDB } from "@/features/notes/db";

// services, features, and other libraries
import { Effect } from "effect";
import { ItemNotFoundError, runPageMainOrNavigate, validatePageInputs } from "@/lib/helpersEffect";
import { NoteDetailsPageSchema } from "@/features/notes/schemas/noteDetailsPage";
import { getUserSessionData } from "@/features/auth/lib/helpersEffect";

// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/BrowseBar";
import NoteDetails from "@/features/notes/components/NoteDetails";

// assets
import { DocumentIcon } from "@heroicons/react/24/outline";

const main = ({ params, searchParams }: PageProps<"/notes/[id]">) =>
  Effect.gen(function* () {
    // Safely validate next.js route inputs (`params` and `searchParams`) against a schema; return typed data or trigger a 404 on failure
    const {
      params: { id: noteId },
      searchParams: { str },
    } = yield* validatePageInputs(NoteDetailsPageSchema, { params, searchParams });

    // Access the user session data from the server side or fail with an unauthorized access error
    const {
      user: { id: userId },
    } = yield* getUserSessionData;

    const noteDB = yield* NoteDB;
    const noteTagDB = yield* NoteTagDB;

    // Get a single note for a user as well as their available note tags
    const [note, availNoteTags] = yield* Effect.all([noteDB.getNote(noteId, userId), noteTagDB.getAvailNoteTags(userId)], { concurrency: 2 });

    // If the note is not found, fail with item not found error
    if (!note) return yield* new ItemNotFoundError({ message: "Note not found" });

    return { str, note, availNoteTags };
  });

// Page remains the fast, static shell
export default function Page({ params, searchParams }: PageProps<"/notes/[id]">) {
  return (
    <Suspense>
      <PageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent({ params, searchParams }: PageProps<"/notes/[id]">) {
  // Execute the main effect for the page, map known errors to the subsequent navigation helpers, and return the payload
  const {
    str,
    note,
    note: { id: noteId, title },
    availNoteTags,
  } = await runPageMainOrNavigate(main({ params, searchParams }));

  return (
    <NoteModal
      icon={<DocumentIcon className="size-11 flex-none" />}
      browseBar={<BrowseBar kind="details" browseBar={{ str }} noteId={noteId} />}
      noteTitle={title}
    >
      <NoteDetails note={note} availNoteTags={availNoteTags} inNoteModal />
    </NoteModal>
  );
}
