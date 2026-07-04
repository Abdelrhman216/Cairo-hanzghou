"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "@/components/layout/I18nProvider";
import { cn } from "@/lib/utils";

export default function UnauthorizedPage() {
  const { locale, dir } = useTranslation();
  const isRtl = dir === "rtl";

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-sand-beige/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-deep-navy/5 font-caslon text-[240px] select-none pointer-events-none font-bold" aria-hidden="true">
          403
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-md w-full bg-white rounded-xl p-8 md:p-10 shadow-luxury border border-outline-variant/10 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 text-error flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-3xl">gavel</span>
          </div>

          <h1 className="font-caslon text-headline-lg text-deep-navy mb-3">
            {locale === "en" ? "Access Forbidden" : "دخول غير مصرح به"}
          </h1>
          
          <p className="font-jakarta text-body-md text-on-surface-variant mb-8 leading-relaxed">
            {locale === "en"
              ? "You do not have the required permissions to view this dashboard or resource. Please sign in with an authorized account or contact your administrator."
              : "لا تمتلك الصلاحيات الكافية للوصول لهذا القسم أو المورد. يرجى تسجيل الدخول بحساب مصرح له أو مراجعة مسؤول النظام."}
          </p>

          <div className={cn("flex gap-3 w-full", isRtl && "flex-row-reverse")}>
            <Link
              href="/login"
              className="flex-1 bg-deep-navy text-white font-jakarta font-bold py-3.5 px-6 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 text-sm active:scale-95 text-center"
            >
              {locale === "en" ? "Sign In" : "تسجيل الدخول"}
            </Link>
            <Link
              href="/"
              className="flex-1 border border-outline-variant text-deep-navy font-jakarta font-semibold py-3.5 px-6 rounded-full hover:bg-sand-beige transition-all duration-300 text-sm text-center"
            >
              {locale === "en" ? "Home" : "الرئيسية"}
            </Link>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  );
}
