import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { assignApplication } from "@/lib/server-store";

/**
 * PUT /api/visa/applications/[id]/assign
 * Body: { employee: string }
 * Admin: Assigns an employee to a visa application.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(request, "visa.update");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  let body: { employee: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { employee } = body;
  if (employee === undefined) {
    return NextResponse.json({ error: "Missing required parameter: employee" }, { status: 400 });
  }

  const updated = await assignApplication(id, employee);
  if (!updated) {
    return NextResponse.json({ error: `Application not found: ${id}` }, { status: 404 });
  }

  return NextResponse.json({ success: true, application: updated });
}
