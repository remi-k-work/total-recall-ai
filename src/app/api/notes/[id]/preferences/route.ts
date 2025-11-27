// next
import { NextResponse } from "next/server";
import { notFound, unauthorized } from "next/navigation";

// drizzle and db access
import { deleteNotePreferences, getNotePreferences, updateNotePreferences } from "@/features/notes/db";

// services, features, and other libraries
import { validateRouteInputs } from "@/lib/helpers";
import { auth } from "@/services/better-auth/auth";
import { NotePreferencesRouteSchema } from "@/features/notes/schemas/noteDetailsPage";

// types
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/notes/[id]/preferences">) {
  // For route handlers — validates params and searchParams, throws 404 if invalid
  const {
    params: { id: noteId },
  } = validateRouteInputs(NotePreferencesRouteSchema, { params: await ctx.params, searchParams: _req.nextUrl.searchParams });

  // Access the user session data from the server side
  // const session = await auth.api.getSession({ headers: _req.headers });
  // if (!session) {
  //   console.log("session not found");
  //   unauthorized();
  // }
  // const {
  //   user: { id: userId },
  // } = session;
  const userId = "yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP";

  // Get the preferences of a note for a user
  const preferences = await getNotePreferences(noteId, userId);

  // If the preferences are not found, return a 404
  if (!preferences) notFound();

  return NextResponse.json(preferences);
}

export async function POST(_req: NextRequest, ctx: RouteContext<"/api/notes/[id]/preferences">) {
  // For route handlers — validates params and searchParams, throws 404 if invalid
  const {
    params: { id: noteId },
  } = validateRouteInputs(NotePreferencesRouteSchema, { params: await ctx.params, searchParams: _req.nextUrl.searchParams });

  // Access the user session data from the server side
  // const session = await auth.api.getSession({ headers: _req.headers });
  // if (!session) {
  //   console.log("session not found");
  //   unauthorized();
  // }
  // const {
  //   user: { id: userId },
  // } = session;
  const userId = "yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP";

  // Update the preferences of a note for a user
  await updateNotePreferences(noteId, userId, await _req.json());

  return new NextResponse(null, { status: 200 });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/notes/[id]/preferences">) {
  // For route handlers — validates params and searchParams, throws 404 if invalid
  const {
    params: { id: noteId },
  } = validateRouteInputs(NotePreferencesRouteSchema, { params: await ctx.params, searchParams: _req.nextUrl.searchParams });

  // Access the user session data from the server side
  // const session = await auth.api.getSession({ headers: _req.headers });
  // if (!session) {
  //   console.log("session not found");
  //   unauthorized();
  // }
  // const {
  //   user: { id: userId },
  // } = session;
  const userId = "yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP";

  // Delete the preferences of a note for a user
  await deleteNotePreferences(noteId, userId);

  return new NextResponse(null, { status: 200 });
}
