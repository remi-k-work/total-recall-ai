// react
import { Suspense } from "react";

// drizzle and db access
import { NoteDB } from "@/features/notes/db";

// services, features, and other libraries
import { Effect } from "effect";
import { runPageMainOrNavigate, validatePageInputs } from "@/lib/helpersEffect";
import { EditNotePageSchema } from "@/features/notes/schemas/editNotePage";
import { Auth } from "@/features/auth/lib/auth";
import { ItemNotFoundError } from "@/lib/errors";

// components
import NoteModal from "@/features/notes/components/NoteModal";
import BrowseBar from "@/features/notes/components/BrowseBar";
import EditNoteForm from "@/features/notes/components/EditNoteForm";

// assets
import { DocumentTextIcon } from "@heroicons/react/24/outline";

const main = ({ params, searchParams }: PageProps<"/notes/[id]/edit">) =>
  Effect.gen(function* () {
    // Safely validate next.js route inputs (`params` and `searchParams`) against a schema; return typed data or trigger a 404 on failure
    const {
      params: { id: noteId },
      searchParams: { str },
    } = yield* validatePageInputs(EditNotePageSchema, { params, searchParams });

    // Access the user session data from the server side or fail with an unauthorized access error
    const auth = yield* Auth;
    const {
      user: { id: userId },
    } = yield* auth.getUserSessionData;

    const noteDB = yield* NoteDB;

    // Get a single note for a user
    const note = yield* noteDB.getNote(noteId, userId);

    // If the note is not found, fail with item not found error
    if (!note) return yield* new ItemNotFoundError({ message: "Note not found" });

    return { str, note };
  });

// Page remains the fast, static shell
export default function Page({ params, searchParams }: PageProps<"/notes/[id]/edit">) {
  return (
    <Suspense>
      <PageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent({ params, searchParams }: PageProps<"/notes/[id]/edit">) {
  // Execute the main effect for the page, map known errors to the subsequent navigation helpers, and return the payload
  const {
    str,
    note,
    note: { id: noteId, title },
  } = await runPageMainOrNavigate(main({ params, searchParams }));

  return (
    <NoteModal
      icon={<DocumentTextIcon className="size-11 flex-none" />}
      browseBar={<BrowseBar kind="edit" browseBar={{ str }} noteId={noteId} />}
      noteTitle={title}
    >
      <EditNoteForm note={note} inNoteModal />
    </NoteModal>
  );
}
