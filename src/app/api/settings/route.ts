import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { getCmsSettings, updateCmsSetting } from "@/lib/server-store";

export async function GET() {
  const settings = await getCmsSettings();
  return NextResponse.json({ settings }, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  const auth = await requirePermission(request, "settings.manage");
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Update each setting key provided
  for (const [key, value] of Object.entries(body)) {
    await updateCmsSetting(key, value);
  }

  const settings = await getCmsSettings();
  return NextResponse.json({ success: true, settings });
}
