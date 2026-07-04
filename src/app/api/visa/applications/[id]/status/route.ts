import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { updateApplicationStatus } from "@/lib/server-store";
import type { ApplicationStatus } from "@/lib/server-store";

/**
 * PUT /api/visa/applications/[id]/status
 * Body: { status: ApplicationStatus }
 * Admin: Updates the status of a visa application, triggers notifications/emails/activity logs.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(request, "visa.update");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  let body: { status: ApplicationStatus };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { status } = body;
  if (!status) {
    return NextResponse.json({ error: "Missing required parameter: status" }, { status: 400 });
  }

  const updated = await updateApplicationStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: `Application not found: ${id}` }, { status: 404 });
  }

  return NextResponse.json({ success: true, application: updated });
}
