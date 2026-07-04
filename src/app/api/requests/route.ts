import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import {
  createTravelRequest,
  getTravelActivityLogs,
  getTravelEmailLogs,
  getTravelRequests,
} from "@/lib/server-store";
import type { RequestType } from "@/lib/server-store";

export async function GET(request: Request) {
  const auth = await requirePermission(request, "reports.read");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  let requests = await getTravelRequests();
  if (type && type !== "All") requests = requests.filter((e) => e.type === type);
  if (status && status !== "All") requests = requests.filter((e) => e.status === status);
  if (search) {
    requests = requests.filter(
      (e) =>
        e.id.toLowerCase().includes(search) ||
        e.customerName.toLowerCase().includes(search) ||
        e.email.toLowerCase().includes(search) ||
        e.title.toLowerCase().includes(search)
    );
  }

  const total = requests.length;
  const paginated = requests.slice((page - 1) * limit, page * limit);

  const [activityLogs, emailLogs] = await Promise.all([
    getTravelActivityLogs(),
    getTravelEmailLogs(),
  ]);

  return NextResponse.json(
    { requests: paginated, total, page, limit, activityLogs, emailLogs },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  let body: {
    customerName: string;
    email: string;
    phone: string;
    type: RequestType;
    title: string;
    details: string;
    amount: number;
    documents?: { name: string; size: string }[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.customerName || !body.email || !body.type || !body.title) {
    return NextResponse.json({ error: "customerName, email, type, and title are required" }, { status: 400 });
  }

  const created = await createTravelRequest(body);
  return NextResponse.json({ success: true, request: created }, { status: 201 });
}
