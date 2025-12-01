// next
import { NextResponse } from "next/server";
import { notFound } from "next/navigation";

// drizzle and db access
import { getNote, getNoteTitle } from "@/features/notes/db";

// services, features, and other libraries
import { validateRouteInputs } from "@/lib/helpers";
import { NoteDetailsRouteSchema } from "@/features/notes/schemas/noteDetailsPage";
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// types
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/notes/[id]">) {
  // For route handlers — validates params and searchParams, throws 404 if invalid
  const {
    params: { id: noteId },
    searchParams: { title },
  } = validateRouteInputs(NoteDetailsRouteSchema, { params: await ctx.params, searchParams: _req.nextUrl.searchParams });

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Retrieve a single note for a user, or just the title if specifically requested
  const noteOrTitle = title ? await getNoteTitle(noteId, userId) : await getNote(noteId, userId);

  // If the note is not found, return a 404
  if (!noteOrTitle) notFound();

  return NextResponse.json(noteOrTitle);
}
