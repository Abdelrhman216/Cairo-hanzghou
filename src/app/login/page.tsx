"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PublicLayout from "@/components/layout/PublicLayout";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/layout/I18nProvider";

const DEV_ACCOUNTS = [
  { roleName: "Super Admin", email: "superadmin@cairohangzhou.com", pass: "password123", desc: "Full Access & Permissions" },
  { roleName: "Admin", email: "admin@cairohangzhou.com", pass: "password123", desc: "Manage Site, Visas & Users" },
  { roleName: "Manager", email: "manager@cairohangzhou.com", pass: "password123", desc: "Reports & Employee Management" },
  { roleName: "Employee", email: "employee@cairohangzhou.com", pass: "password123", desc: "Process Visa Applications" },
  { roleName: "Customer", email: "customer@cairohangzhou.com", pass: "password123", desc: "Book Flights, Hotels & View Profile" },
];

export default function LoginPage() {
  const { locale, dir } = useTranslation();
  const isRtl = dir === "rtl";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed");
      } else {
        // Trigger session update and redirect
        // For admin dashboard users, redirect to /admin, else /profile
        const isStaff = email.includes("admin") || email.includes("manager") || email.includes("employee");
        router.refresh();
        if (isStaff) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (acc: typeof DEV_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-deep-navy flex items-center justify-center pt-24 pb-12 px-5 md:px-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-champagne-gold/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full z-10">
          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 md:p-10 flex flex-col justify-between shadow-luxury-lg"
          >
            <div>
              <div className={cn("flex items-center gap-3 mb-8", isRtl && "flex-row-reverse justify-end")}>
                <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-lg object-cover" />
                <span className="font-caslon text-white tracking-widest text-lg font-bold">CAIRO HANGZHOU</span>
              </div>

              <h1 className={cn("font-caslon text-headline-lg text-white mb-2", isRtl && "text-right")}>
                {locale === "en" ? "Welcome Back" : "أهلاً بك مجدداً"}
              </h1>
              <p className={cn("font-jakarta text-white/60 text-body-md mb-8", isRtl && "text-right")}>
                {locale === "en" ? "Sign in to access your curated dashboard and travel requests." : "سجل الدخول للوصول لبوابة إدارة طلبات وخدمات السفر الفاخرة."}
              </p>

              {error && (
                <div className={cn("bg-error/15 border border-error/30 text-error p-4 rounded-xl text-sm font-semibold mb-6 font-jakarta flex items-center gap-2", isRtl && "flex-row-reverse text-right")}>
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className={cn("font-jakarta font-semibold text-label-sm text-white/70 uppercase tracking-wider block", isRtl && "text-right")}>
                    {locale === "en" ? "Email Address" : "البريد الإلكتروني"}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="off"
                    className={cn(
                      "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-jakarta text-body-md text-white placeholder-white/30 focus:outline-none focus:border-champagne-gold focus:bg-white/10 transition-all",
                      isRtl && "text-right"
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className={cn("font-jakarta font-semibold text-label-sm text-white/70 uppercase tracking-wider block", isRtl && "text-right")}>
                    {locale === "en" ? "Password" : "كلمة المرور"}
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={cn(
                      "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-jakarta text-body-md text-white placeholder-white/30 focus:outline-none focus:border-champagne-gold focus:bg-white/10 transition-all",
                      isRtl && "text-right"
                    )}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-champagne-gold text-deep-navy font-jakarta font-bold py-4 rounded-xl hover:bg-white transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-2 shadow-luxury mt-6"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-deep-navy border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">login</span>
                      <span>{locale === "en" ? "Sign In" : "تسجيل الدخول"}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className={cn("mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-jakarta", isRtl && "flex-row-reverse")}>
              <span>&copy; {new Date().getFullYear()} Cairo Hangzhou</span>
              <Link href="/" className="hover:text-champagne-gold transition-colors">
                {locale === "en" ? "Back to Homepage" : "العودة للرئيسية"}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
