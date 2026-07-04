import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { getTravelRequests } from "@/lib/server-store";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { user, permissions } = auth;
  const allRequests = await getTravelRequests();
  const requests = permissions.includes("reports.read")
    ? allRequests
    : allRequests.filter((entry) => entry.email === user.email);

  return NextResponse.json({ requests }, {
    headers: { "Cache-Control": "no-store" },
  });
}
