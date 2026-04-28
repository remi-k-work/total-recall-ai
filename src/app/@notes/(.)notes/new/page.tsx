// react
import { Suspense } from "react";

// services, features, and other libraries
import { Effect } from "effect";
import { runPageMainOrNavigate, validatePageInputs } from "@/lib/helpersEffect";
import { NewNotePageSchema } from "@/features/notes/schemas/newNotePage";
import { Auth } from "@/features/auth/lib/auth";

// components
import NoteModal from "@/features/notes/components/NoteModal";
import BrowseBar from "@/features/notes/components/BrowseBar";
import NewNoteForm from "@/features/notes/components/NewNoteForm";

// assets
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

const main = ({ params, searchParams }: PageProps<"/notes/new">) =>
  Effect.gen(function* () {
    // Safely validate next.js route inputs (`params` and `searchParams`) against a schema; return typed data or trigger a 404 on failure
    const {
      searchParams: { str },
    } = yield* validatePageInputs(NewNotePageSchema, { params, searchParams });

    // Access the user session data from the server side or fail with an unauthorized access error
    const auth = yield* Auth;
    yield* auth.getUserSessionData;

    return { str };
  });

// Page remains the fast, static shell
export default function Page({ params, searchParams }: PageProps<"/notes/new">) {
  return (
    <Suspense>
      <PageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent({ params, searchParams }: PageProps<"/notes/new">) {
  // Execute the main effect for the page, map known errors to the subsequent navigation helpers, and return the payload
  const { str } = await runPageMainOrNavigate(main({ params, searchParams }));

  return (
    <NoteModal icon={<DocumentPlusIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="new" browseBar={{ str }} />}>
      <NewNoteForm inNoteModal />
    </NoteModal>
  );
}
