import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { getAllRoles, getAllPermissions, getRolePermissions, updateRolePermissions } from "@/lib/server-store";

export async function GET(request: Request) {
  try {
    const auth = await requirePermission(request, "role.manage");
    if (auth instanceof NextResponse) return auth;

    const [rolesList, permissionsList] = await Promise.all([getAllRoles(), getAllPermissions()]);

    const rolesWithPerms = await Promise.all(
      rolesList.map(async (role) => {
        const permCodes = await getRolePermissions(role.id);
        return { ...role, permissions: permCodes };
      })
    );

    return NextResponse.json({
      roles: rolesWithPerms,
      allPermissions: permissionsList,
    });
  } catch (error) {
    console.error("GET roles error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requirePermission(request, "role.manage");
    if (auth instanceof NextResponse) return auth;

    const { roleId, permissionCodes } = await request.json();

    if (!roleId || !Array.isArray(permissionCodes)) {
      return NextResponse.json({ error: "roleId and permissionCodes are required" }, { status: 400 });
    }

    const success = await updateRolePermissions(roleId, permissionCodes);
    if (!success) {
      return NextResponse.json({ error: "Failed to update role permissions" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT roles error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
