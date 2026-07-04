import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/server-store";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/ch_session=([^;]+)/);

    if (match) {
      const token = decodeURIComponent(match[1]);
      await deleteSession(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("ch_session", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });
    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
