import { NextResponse } from "next/server";
import { getUserFromRequest, getDynamicNavigation } from "@/lib/auth-middleware";
import { getUserRoles } from "@/lib/server-store";

export async function GET(request: Request) {
  try {
    const auth = await getUserFromRequest(request);
    if (!auth) {
      const guestNav = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Flights", href: "/flights", icon: "flight" },
        { label: "Hotels", href: "/hotels", icon: "apartment" },
        { label: "Packages", href: "/packages", icon: "history_edu" },
        { label: "Visa", href: "/visa", icon: "description" },
      ];
      return NextResponse.json({
        authenticated: false,
        user: null,
        permissions: [],
        navigation: guestNav,
      });
    }

    const { user, permissions } = auth;
    const roles = await getUserRoles(user.id);
    const primaryRole = roles[0]?.name || "Customer";
    const dynamicNav = getDynamicNavigation(permissions);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: primaryRole,
      },
      permissions,
      navigation: dynamicNav,
    });
  } catch (error) {
    console.error("Auth Me API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
