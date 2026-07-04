"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/layout/I18nProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { locale, changeLanguage, dir, t } = useTranslation();

  const isRtl = dir === "rtl";

  // Auth State dynamically loaded from backend single source of truth
  const [authState, setAuthState] = useState<{
    authenticated: boolean;
    user: { id: string; name: string; email: string; role: string } | null;
    permissions: string[];
    navigation: { label: string; href: string; icon: string }[];
  }>({
    authenticated: false,
    user: null,
    permissions: [],
    navigation: [
      { label: "Home", href: "/", icon: "home" },
      { label: "Flights", href: "/flights", icon: "flight" },
      { label: "Hotels", href: "/hotels", icon: "apartment" },
      { label: "Packages", href: "/packages", icon: "history_edu" },
      { label: "Visa", href: "/visa", icon: "description" },
    ],
  });

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data && data.navigation) {
        setAuthState({
          authenticated: data.authenticated,
          user: data.user,
          permissions: data.permissions,
          navigation: data.navigation,
        });
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const toggleLanguage = () => {
    changeLanguage(locale === "en" ? "ar" : "en");
  };

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
    const map: Record<string, string> = {
      "Home": locale === "en" ? "Home" : "الرئيسية",
      "Flights": locale === "en" ? "Flights" : "رحلات الطيران",
      "Hotels": locale === "en" ? "Hotels" : "الفنادق والمنتجعات",
      "Packages": locale === "en" ? "Packages" : "البرامج السياحية",
      "Visa": locale === "en" ? "Visa" : "تأشيرات السفر",
      "Dashboard": locale === "en" ? "Dashboard" : "لوحة التحكم",
      "My Bookings": locale === "en" ? "My Bookings" : "حجوزاتي",
      "My Documents": locale === "en" ? "My Documents" : "مستنداتي",
      "Settings": locale === "en" ? "Settings" : "إعدادات الحساب",
      "Overview": locale === "en" ? "Overview" : "نظرة عامة",
      "Team Dashboard": locale === "en" ? "Team Dashboard" : "لوحة تحكم الفريق",
      "Assigned Applications": locale === "en" ? "Assigned Applications" : "طلباتي المعينة",
      "Customers": locale === "en" ? "Customers" : "العملاء",
      "Reports": locale === "en" ? "Reports" : "التقارير المالية",
      "Employee Management": locale === "en" ? "Employee Management" : "إدارة الموظفين",
    };
    return map[lbl] || lbl;
  };

  const profileLink = authState.authenticated
    ? (authState.user?.role === "Customer" ? "/profile" : "/admin")
    : "/login";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || menuOpen || pathname === "/profile" || pathname.startsWith("/admin")
            ? "glass shadow-luxury border-b border-white/20"
            : "bg-transparent"
        )}
      >
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16 h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-deep-navy flex items-center justify-center">
              <Image
                src="/logo.jpg"
                alt="Cairo Hangzhou Logo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className={cn(
                "font-caslon font-bold text-base tracking-[0.15em] leading-tight group-hover:text-champagne-gold transition-colors duration-300",
                (scrolled || menuOpen || pathname === "/profile" || pathname.startsWith("/admin")) ? "text-deep-navy" : "text-white"
              )}>
                CAIRO HANGZHOU
              </p>
              <p className={cn(
                "text-[10px] font-jakarta font-medium tracking-[0.12em] uppercase transition-colors duration-300",
                (scrolled || menuOpen || pathname === "/profile" || pathname.startsWith("/admin")) ? "text-outline" : "text-white/60"
              )}>
                {locale === "en" ? "Visa & Travel Services" : "خدمات التأشيرات والسياحة"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation (Dynamically Role-driven) */}
          <nav className={cn("hidden lg:flex items-center gap-8", isRtl && "flex-row-reverse")} role="navigation" aria-label="Main navigation">
            {authState.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative font-jakarta text-label-lg tracking-wider transition-colors duration-300 group py-1",
                  pathname === item.href
                    ? "text-champagne-gold"
                    : (scrolled || menuOpen || pathname === "/profile" || pathname.startsWith("/admin"))
                      ? "text-deep-navy hover:text-champagne-gold"
                      : "text-white/90 hover:text-champagne-gold"
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {localizedLabel(item.label)}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-0.5 bg-champagne-gold transition-all duration-300",
                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className={cn(
                "flex items-center gap-1.5 font-jakarta font-semibold text-xs px-3 py-1.5 rounded transition-all duration-300 active:scale-95 border",
                (scrolled || menuOpen || pathname === "/profile" || pathname.startsWith("/admin"))
                  ? "border-outline-variant bg-sand-beige text-deep-navy hover:border-champagne-gold"
                  : "border-white/20 bg-white/10 text-white hover:border-champagne-gold"
              )}
              aria-label={locale === "en" ? "Switch to Arabic" : "تغيير للإنجليزية"}
            >
              <span className="material-symbols-outlined text-sm">language</span>
              {locale === "en" ? "AR" : "EN"}
            </button>

            {/* Book Now CTA */}
            <Link
              href="/packages"
              className={cn(
                "hidden md:inline-flex items-center gap-2 font-jakarta font-semibold text-sm px-6 py-2.5 rounded transition-all duration-300 active:scale-95 shadow-luxury",
                (scrolled || menuOpen || pathname === "/profile" || pathname.startsWith("/admin"))
                  ? "bg-deep-navy text-white hover:bg-champagne-gold hover:text-deep-navy"
                  : "bg-white text-deep-navy hover:bg-champagne-gold hover:text-deep-navy"
              )}
            >
              <span className="material-symbols-outlined text-sm">explore</span>
              {t("nav.bookNow")}
            </Link>

            {/* Profile Avatar / Sign In */}
            <Link
              href={profileLink}
              className={cn(
                "w-10 h-10 rounded border flex items-center justify-center overflow-hidden transition-colors duration-300",
                (scrolled || menuOpen || pathname === "/profile" || pathname.startsWith("/admin"))
                  ? "bg-sand-beige border-outline-variant hover:border-champagne-gold"
                  : "bg-white/10 border-white/20 hover:border-champagne-gold"
              )}
              aria-label="Profile"
              title={authState.authenticated ? `${authState.user?.name} (${authState.user?.role})` : "Login / Register"}
            >
              <span className={cn(
                "material-symbols-outlined text-xl",
                (scrolled || menuOpen || pathname === "/profile" || pathname.startsWith("/admin")) ? "text-deep-navy" : "text-white"
              )}>person</span>
            </Link>

            {/* Logout (Shown only when authenticated) */}
            {authState.authenticated && (
              <button
                onClick={handleLogout}
                className={cn(
                  "hidden lg:flex w-10 h-10 items-center justify-center rounded transition-colors text-error hover:bg-red-500/10",
                  (scrolled || menuOpen || pathname === "/profile" || pathname.startsWith("/admin"))
                    ? "text-error"
                    : "text-red-400"
                )}
                title={locale === "en" ? "Sign Out" : "تسجيل الخروج"}
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn(
                "lg:hidden w-10 h-10 flex items-center justify-center transition-colors duration-300",
                (scrolled || menuOpen || pathname === "/profile" || pathname.startsWith("/admin")) ? "text-deep-navy hover:text-champagne-gold" : "text-white hover:text-champagne-gold"
              )}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, x: isRtl ? "-100%" : "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? "-100%" : "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-deep-navy/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <div
              className={cn(
                "absolute top-0 h-full w-80 bg-white shadow-luxury-lg flex flex-col justify-between p-6",
                isRtl ? "left-0" : "right-0"
              )}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-outline-variant/30">
                  <p className="font-caslon font-bold tracking-[0.15em] text-deep-navy">
                    CAIRO HANGZHOU
                  </p>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center text-deep-navy hover:text-champagne-gold"
                    aria-label="Close menu"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="py-6 space-y-2" role="navigation" aria-label="Mobile navigation">
                  {authState.navigation.map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                          isRtl ? "flex-row-reverse text-right" : "flex-row text-left",
                          pathname === item.href
                            ? "bg-sand-beige text-champagne-gold"
                            : "text-deep-navy hover:bg-sand-beige hover:text-champagne-gold"
                        )}
                        aria-current={pathname === item.href ? "page" : undefined}
                      >
                        <span
                          className={cn(
                            "material-symbols-outlined text-xl",
                            pathname === item.href ? "text-champagne-gold" : "text-outline group-hover:text-champagne-gold"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="font-jakarta font-semibold text-sm tracking-wider">
                          {localizedLabel(item.label)}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="border-t border-outline-variant/30 pt-6 space-y-3">
                {/* Language Switcher in Drawer */}
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-center gap-2 border border-deep-navy/20 text-deep-navy font-jakarta font-bold py-3.5 rounded-full hover:bg-sand-beige transition-all duration-300"
                >
                  <span className="material-symbols-outlined text-sm">language</span>
                  {locale === "en" ? "العربية (AR)" : "English (EN)"}
                </button>

                <Link
                  href="/packages"
                  className="w-full flex items-center justify-center gap-2 bg-champagne-gold text-deep-navy font-jakarta font-bold py-3.5 rounded-full transition-all duration-300 active:scale-95 text-center"
                >
                  <span className="material-symbols-outlined text-sm">explore</span>
                  {t("nav.bookNow")}
                </Link>

                {authState.authenticated && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 border border-red-200/50 text-error font-jakarta font-bold py-3 rounded-full hover:bg-red-50 transition-all duration-300 text-center"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    {locale === "en" ? "Sign Out" : "تسجيل الخروج"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
