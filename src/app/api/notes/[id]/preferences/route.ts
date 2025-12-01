// next
import { NextResponse } from "next/server";
import { notFound } from "next/navigation";

// drizzle and db access
import { deleteNotePreferences, getNotePreferences, updateNotePreferences } from "@/features/notes/db";

// services, features, and other libraries
import { isDeepEqual, validateRouteInputs } from "@/lib/helpers";
import { NotePreferencesRouteSchema } from "@/features/notes/schemas/noteDetailsPage";
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// types
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/notes/[id]/preferences">) {
  // For route handlers — validates params and searchParams, throws 404 if invalid
  const {
    params: { id: noteId },
  } = validateRouteInputs(NotePreferencesRouteSchema, { params: await ctx.params, searchParams: _req.nextUrl.searchParams });

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Get the preferences of a note for a user
  const preferences = await getNotePreferences(noteId, userId);

  // If the preferences are not found, return a 404
  if (!preferences) notFound();

  return NextResponse.json(preferences.preferences);
}

export async function POST(_req: NextRequest, ctx: RouteContext<"/api/notes/[id]/preferences">) {
  // For route handlers — validates params and searchParams, throws 404 if invalid
  const {
    params: { id: noteId },
  } = validateRouteInputs(NotePreferencesRouteSchema, { params: await ctx.params, searchParams: _req.nextUrl.searchParams });

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Zustand's persist middleware can be aggressive, so reject identical updates to prevent unnecessary writes
  const incomingPreferences = await _req.json();
  const currentPreferences = await getNotePreferences(noteId, userId);
  if (currentPreferences && isDeepEqual(incomingPreferences, currentPreferences.preferences)) return new NextResponse(null, { status: 204 });

  // Update the preferences of a note for a user
  await updateNotePreferences(noteId, userId, incomingPreferences);

  return new NextResponse(null, { status: 200 });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/notes/[id]/preferences">) {
  // For route handlers — validates params and searchParams, throws 404 if invalid
  const {
    params: { id: noteId },
  } = validateRouteInputs(NotePreferencesRouteSchema, { params: await ctx.params, searchParams: _req.nextUrl.searchParams });

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Delete the preferences of a note for a user
  await deleteNotePreferences(noteId, userId);

  return new NextResponse(null, { status: 200 });
}
