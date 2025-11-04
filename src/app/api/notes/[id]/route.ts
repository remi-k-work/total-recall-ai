// next
import { NextResponse } from "next/server";
import { notFound } from "next/navigation";

// drizzle and db access
import { getNote } from "@/features/notes/db";

// services, features, and other libraries
import { validateRouteInputs } from "@/lib/helpers";
import { NoteDetailsPageSchema } from "@/features/notes/schemas/noteDetailsPage";
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// types
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/notes/[id]">) {
  // For route handlers — validates params and searchParams, throws 404 if invalid
  const {
    params: { id: noteId },
  } = validateRouteInputs(NoteDetailsPageSchema, { params: await ctx.params, searchParams: _req.nextUrl.searchParams });

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Get a single note for a user
  const note = await getNote(noteId, userId);

  // If the note is not found, return a 404
  if (!note) notFound();

  return NextResponse.json(note);
}
