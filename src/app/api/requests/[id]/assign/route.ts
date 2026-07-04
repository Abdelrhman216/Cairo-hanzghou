import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { assignTravelRequest } from "@/lib/server-store";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(request, "reports.read");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => null) as { assignedTo?: string } | null;
  if (!body || body.assignedTo === undefined) {
    return NextResponse.json({ error: "assignedTo is required" }, { status: 400 });
  }

  const updated = await assignTravelRequest(id, body.assignedTo);
  if (!updated) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  return NextResponse.json({ success: true, request: updated });
}
