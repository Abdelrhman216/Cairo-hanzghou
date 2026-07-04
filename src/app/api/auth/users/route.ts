import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { getAllUsersWithRoles } from "@/lib/server-store";

export async function GET(request: Request) {
  try {
    const auth = await requirePermission(request, "users.read");
    if (auth instanceof NextResponse) return auth;

    const users = await getAllUsersWithRoles();

    return NextResponse.json({
      users: users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        status: u.status,
        joinedDate: u.joinedDate,
        roles: u.roles,
        roleId: u.roleIds[0] || "",
      })),
    });
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
