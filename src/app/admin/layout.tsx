import AdminSidebar from "@/components/layout/AdminSidebar";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession, getUserPermissions } from "@/lib/server-store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | Cairo Hangzhou",
    template: "%s | Admin | Cairo Hangzhou",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ch_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const session = await getSession(token);
  if (!session) {
    redirect("/login");
  }

  const permissions = await getUserPermissions(session.userId);
  if (!permissions.includes("admin.access")) {
    redirect("/unauthorized");
  }

  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const isRtl = locale === "ar";

  return (
    <div className={cn("flex min-h-screen bg-background", isRtl && "flex-row-reverse")}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Topbar */}
        <header className={cn("h-16 bg-white border-b border-outline-variant/30 flex items-center justify-between px-8 sticky top-0 z-30 shadow-luxury", isRtl && "flex-row-reverse")}>
          <h1 className="font-caslon text-headline-md text-deep-navy">
            {locale === "en" ? "Admin Portal" : "لوحة التحكم للمسؤولين"}
          </h1>
          <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
            <button className="relative w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-champagne-gold transition-colors" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" aria-hidden="true" />
            </button>
            <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
              <div className="w-8 h-8 rounded-full bg-sand-beige flex items-center justify-center">
                <span className="material-symbols-outlined text-champagne-gold text-lg">person</span>
              </div>
              <span className="font-jakarta font-semibold text-sm text-deep-navy hidden md:block">
                {locale === "en" ? "Administrator" : "المشرف العام"}
              </span>
            </div>
          </div>
        </header>
        <main className={cn("flex-1 p-8 overflow-auto", isRtl && "text-right")}>
          {children}
        </main>
      </div>
    </div>
  );
}
