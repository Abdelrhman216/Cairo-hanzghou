import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { addTravelRequestNote } from "@/lib/server-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(request, "reports.read");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => null) as { content?: string; author?: string } | null;
  if (!body?.content) return NextResponse.json({ error: "content is required" }, { status: 400 });

  const updated = await addTravelRequestNote(id, body.content, body.author ?? "Admin");
  if (!updated) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  return NextResponse.json({ success: true, request: updated });
}
