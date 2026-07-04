import { NextResponse } from "next/server";
import { getSession, getUserById, getUserPermissions, type User } from "./server-store";

/**
 * Retrieves the authenticated user from the request's cookies (async).
 */
export async function getUserFromRequest(request: Request): Promise<{ user: User; permissions: string[] } | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/ch_session=([^;]+)/);
  if (!match) return null;

  const token = decodeURIComponent(match[1]);
  const session = await getSession(token);
  if (!session) return null;

  const user = await getUserById(session.userId);
  if (!user || user.status === "inactive") return null;

  const permissions = await getUserPermissions(user.id);
  return { user, permissions };
}

/**
 * Enforces authentication. Returns User or a NextResponse 401 error.
 */
export async function requireAuth(request: Request): Promise<{ user: User; permissions: string[] } | NextResponse> {
  const auth = await getUserFromRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return auth;
}

/**
 * Enforces a specific permission. Returns User or a NextResponse 403 error.
 */
export async function requirePermission(request: Request, permissionCode: string): Promise<{ user: User; permissions: string[] } | NextResponse> {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  if (!auth.permissions.includes(permissionCode)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return auth;
}

export interface NavItemDto {
  label: string;
  href: string;
  icon: string;
}

/**
 * Compiles dynamic navigation links based on user permissions.
 * This ensures the backend is the single source of truth.
 */
export function getDynamicNavigation(permissions: string[]): NavItemDto[] {
  const nav: NavItemDto[] = [];

  // Super Admin / Admin
  if (permissions.includes("settings.manage")) {
    nav.push(
      { label: "Overview", href: "/admin", icon: "dashboard" },
      { label: "Hotel Bookings", href: "/admin/bookings/hotels", icon: "hotel" },
      { label: "Flight Requests", href: "/admin/bookings/flights", icon: "flight" },
      { label: "Package Inventory", href: "/admin/packages", icon: "inventory_2" },
      { label: "User Management", href: "/admin/users", icon: "group" },
      { label: "Visa Applications", href: "/admin/visa", icon: "badge" },
      { label: "Visa Requirements DB", href: "/admin/visa/requirements", icon: "public" },
      { label: "Payments & Analytics", href: "/admin/payments", icon: "bar_chart" },
      { label: "Support Center", href: "/admin/support", icon: "support_agent" },
      { label: "Campaigns & Alerts", href: "/admin/campaigns", icon: "campaign" },
      { label: "System Settings", href: "/admin/settings", icon: "settings" }
    );
    return nav;
  }

  // Manager
  if (permissions.includes("reports.read") && permissions.includes("users.read")) {
    nav.push(
      { label: "Team Dashboard", href: "/admin", icon: "dashboard" },
      { label: "Reports", href: "/admin/payments", icon: "bar_chart" },
      { label: "Employee Management", href: "/admin/users", icon: "group" },
      { label: "Visa Applications", href: "/admin/visa", icon: "badge" },
      { label: "Support Center", href: "/admin/support", icon: "support_agent" }
    );
    return nav;
  }

  // Employee
  if (permissions.includes("admin.access")) {
    nav.push(
      { label: "Assigned Applications", href: "/admin/visa", icon: "badge" },
      { label: "Customers", href: "/admin/users", icon: "group" },
      { label: "Support Center", href: "/admin/support", icon: "support_agent" }
    );
    return nav;
  }

  // Customer — never gets admin sidebar nav
  if (permissions.includes("customer.access")) {
    nav.push(
      { label: "My Applications", href: "/profile", icon: "badge" },
      { label: "Profile", href: "/profile", icon: "person" }
    );
  }

  return nav;
}
