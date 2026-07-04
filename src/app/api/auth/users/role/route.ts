import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { updateUserRole } from "@/lib/server-store";

export async function PUT(request: Request) {
  try {
    const auth = await requirePermission(request, "role.manage");
    if (auth instanceof NextResponse) return auth;

    const { userId, roleId } = await request.json();

    if (!userId || !roleId) {
      return NextResponse.json({ error: "userId and roleId are required" }, { status: 400 });
    }

    const success = await updateUserRole(userId, roleId);
    if (!success) {
      return NextResponse.json({ error: "Failed to update user role" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT user role error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
