import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { addNote } from "@/lib/server-store";

/**
 * POST /api/visa/applications/[id]/note
 * Body: { content: string, author?: string }
 * Admin: Adds an internal note to a visa application.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(request, "visa.update");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  let body: { content: string; author?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { content, author } = body;
  if (!content) {
    return NextResponse.json({ error: "Missing required parameter: content" }, { status: 400 });
  }

  const updated = await addNote(id, content, author || "Admin");
  if (!updated) {
    return NextResponse.json({ error: `Application not found: ${id}` }, { status: 404 });
  }

  return NextResponse.json({ success: true, application: updated });
}
