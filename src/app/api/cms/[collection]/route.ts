import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import {
  deleteCmsItem,
  getCmsCollection,
  getCmsItem,
  updateCmsItem,
  upsertCmsItem,
} from "@/lib/server-store";

const PUBLIC_COLLECTIONS = new Set([
  "destinations",
  "packages",
  "hotels",
  "flights",
  "stats",
  "testimonials",
  "homeShortcuts",
  "navigation",
  "services",
  "countries",
  "faqs",
  "blogs",
]);

function mutationPermission(collection: string) {
  if (collection === "packages") return "packages.manage";
  if (collection === "settings") return "settings.manage";
  if (collection === "adminNavigation") return "role.manage";
  return "settings.manage";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const search = searchParams.get("search")?.toLowerCase();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  if (!PUBLIC_COLLECTIONS.has(collection) && collection !== "adminNavigation") {
    const auth = await requirePermission(request, mutationPermission(collection));
    if (auth instanceof NextResponse) return auth;
  }

  if (id) {
    const item = await getCmsItem(collection, id);
    return NextResponse.json(
      { item: item ?? null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  let items = await getCmsCollection(collection);

  // Apply search filter if provided
  if (search) {
    items = items.filter((item: any) => {
      const searchableFields = ["name", "title", "label", "question", "countryName", "airline"];
      return searchableFields.some((field) =>
        item[field]?.toLowerCase().includes(search)
      );
    });
  }

  // Pagination
  const total = items.length;
  const start = (page - 1) * limit;
  const paginated = items.slice(start, start + limit);

  return NextResponse.json(
    {
      items: paginated,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  const auth = await requirePermission(request, mutationPermission(collection));
  if (auth instanceof NextResponse) return auth;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const item = await upsertCmsItem(collection, body);
  return NextResponse.json({ success: true, item });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  const auth = await requirePermission(request, mutationPermission(collection));
  if (auth instanceof NextResponse) return auth;

  let body: { id: string; patch: Record<string, any> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.id || !body.patch) {
    return NextResponse.json({ error: "id and patch are required" }, { status: 400 });
  }

  const item = await updateCmsItem(collection, body.id, body.patch);
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  return NextResponse.json({ success: true, item });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  const auth = await requirePermission(request, mutationPermission(collection));
  if (auth instanceof NextResponse) return auth;

  let body: { id: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const success = await deleteCmsItem(collection, body.id);
  return NextResponse.json({ success });
}
