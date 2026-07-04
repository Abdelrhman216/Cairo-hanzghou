import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { updateTravelRequestStatus } from "@/lib/server-store";
import type { RequestStatus } from "@/lib/server-store";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(request, "reports.read");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => null) as { status?: RequestStatus } | null;
  if (!body?.status) return NextResponse.json({ error: "status is required" }, { status: 400 });

  const updated = await updateTravelRequestStatus(id, body.status);
  if (!updated) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  return NextResponse.json({ success: true, request: updated });
}
