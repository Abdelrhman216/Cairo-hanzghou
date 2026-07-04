"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/layout/I18nProvider";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, dir } = useTranslation();
  const isRtl = dir === "rtl";

  const [navigation, setNavigation] = useState<{ label: string; href: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNav() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.navigation) {
          setNavigation(data.navigation);
        } else {
          // If not authenticated or has no admin access, redirect to login
          router.push("/unauthorized");
        }
      } catch (err) {
        console.error("Failed to load admin navigation:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNav();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      router.push("/");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const localizedLabel = (lbl: string) => {
    const translations: Record<string, string> = {
      "Overview": "نظرة عامة",
      "Hotel Bookings": "حجوزات الفنادق",
      "Flight Requests": "طلبات الطيران",
      "Package Inventory": "مخزون البرامج",
      "User Management": "إدارة المستخدمين",
      "Visa Applications": "طلبات التأشيرة",
      "Visa Requirements DB": "قاعدة بيانات التأشيرات",
      "Payments & Analytics": "المدفوعات والتحليلات",
      "Support Center": "مركز الدعم الفني",
      "Campaigns & Alerts": "الحملات والتنبيهات",
      "System Settings": "إعدادات النظام",
      "Team Dashboard": "لوحة تحكم الفريق",
      "Reports": "التقارير والإحصائيات",
      "Employee Management": "إدارة الموظفين",
      "Assigned Applications": "طلباتي المعينة",
      "Customers": "قائمة العملاء",
    };
    return translations[lbl] || lbl;
  };

  if (loading) {
    return (
      <aside className="w-64 min-h-screen bg-deep-navy flex flex-col items-center justify-center">
        <div className="w-6 h-6 border-2 border-champagne-gold border-t-transparent rounded-full animate-spin" />
      </aside>
    );
  }

  return (
    <aside className="w-64 min-h-screen bg-deep-navy flex flex-col" role="navigation" aria-label="Admin navigation">
      {/* Brand Header */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className={cn("flex flex-col", isRtl && "text-right")}>
          <p className="font-caslon font-bold text-sm tracking-[0.2em] text-white">
            CAIRO HANGZHOU
          </p>
          <p className="text-[10px] font-jakarta text-champagne-gold tracking-[0.15em] uppercase mt-0.5">
            {locale === "en" ? "Admin Portal" : "بوابة الإدارة"}
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isRtl ? "flex-row-reverse text-right" : "flex-row text-left",
                isActive
                  ? "bg-champagne-gold/10 text-champagne-gold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-active-indicator"
                  className={cn(
                    "absolute top-0 bottom-0 w-0.5 bg-champagne-gold rounded",
                    isRtl ? "right-0" : "left-0"
                  )}
                />
              )}
              <span
                className={cn(
                  "material-symbols-outlined text-lg shrink-0 transition-colors duration-300",
                  isActive ? "text-champagne-gold" : "text-white/40 group-hover:text-white"
                )}
              >
                {item.icon}
              </span>
              <span className="font-jakarta font-medium text-sm">{localizedLabel(item.label)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 text-white/50 hover:text-white text-sm font-jakarta transition-colors duration-300 px-2 py-2 rounded-lg hover:bg-white/5",
            isRtl && "flex-row-reverse"
          )}
        >
          <span className={cn("material-symbols-outlined text-base", isRtl && "rotate-180")}>arrow_back</span>
          <span>{locale === "en" ? "Back to Site" : "العودة للموقع"}</span>
        </Link>
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 text-red-400 hover:text-error text-sm font-jakarta transition-colors duration-300 px-2 py-2 rounded-lg hover:bg-red-500/10",
            isRtl && "flex-row-reverse text-right"
          )}
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>{locale === "en" ? "Sign Out" : "تسجيل الخروج"}</span>
        </button>
      </div>
    </aside>
  );
}
