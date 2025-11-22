// react
import { Suspense } from "react";

// next
import { cacheLife } from "next/cache";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { NoteDetailsPageSchema } from "@/features/notes/schemas/noteDetailsPage";

// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import NoteDetails from "@/features/notes/components/NoteDetails";

// assets
import { DocumentIcon } from "@heroicons/react/24/outline";
import DynamicContent from "./DynamicContent";

// Page remains the fast, static shell
export default function Page({ params, searchParams }: PageProps<"/notes/[id]">) {
  return (
    <Suspense fallback={<p>Loading your note...</p>}>
      <DynamicContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// async function DynamicContent({ params }: PageProps<"/notes/[id]">) {
//   // "use cache";
//   // cacheLife("hours");

//   const { id: noteId } = await params;

//   return (
//     <>
//       <p>Hello {noteId}</p>
//       <p>{noteId}</p>
//     </>
//   );
// }

// This new async component contains the dynamic logic
async function PageContent({ params, searchParams }: PageProps<"/notes/[id]">) {
  // await connection();

  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  // const {
  //   params: { id: noteId },
  // } = await validatePageInputs(NoteDetailsPageSchema, { params, searchParams });

  const { id } = await params;
  const noteId = "8f149149-f54c-4255-9824-a7e68073ed46";

  return (
    <>
      <p>Hello {id}</p>
      <p>{noteId}</p>
    </>
    // <NoteModal icon={<DocumentIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="note-details" />} noteId={noteId}>
    //   <NoteDetails noteId={noteId} />
    // </NoteModal>
  );
}

function PageSkeleton() {
  return null;
}
