import { NextResponse } from "next/server";
import { getPackages } from "@/lib/server-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";

  const pkgs = await getPackages(lang);
  return NextResponse.json({ packages: pkgs });
}
