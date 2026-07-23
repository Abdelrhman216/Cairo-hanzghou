"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "@/components/layout/I18nProvider";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "Card authentication failed or insufficient funds.";
  const { locale } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-8 lg:p-12 max-w-xl w-full text-center shadow-luxury-lg border border-outline-variant/20 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-6">
        <span className="material-symbols-outlined text-4xl">error_outline</span>
      </div>

      <h1 className="font-caslon text-display-sm text-deep-navy mb-2">
        {locale === "en" ? "Payment Failed" : "فشلت عملية الدفع"}
      </h1>
      <p className="font-jakarta text-xs text-error font-bold uppercase tracking-widest mb-6">
        {locale === "en" ? "Transaction Unsuccessful" : "لم تكتمل المعاملة"}
      </p>

      <div className="bg-red-50 text-red-800 w-full rounded-xl p-4 mb-6 text-left space-y-1 font-jakarta text-xs border border-red-200">
        <span className="font-bold">{locale === "en" ? "Reason:" : "السبب:"}</span>
        <p className="mt-1">{reason}</p>
      </div>

      <p className="font-jakarta text-body-md text-on-surface-variant mb-8 leading-relaxed">
        {locale === "en"
          ? "We were unable to process your payment in Egyptian Pounds (EGP). Please check your card details or try a different card."
          : "تعذر علينا معالجة المدفوعات بالجنيه المصري. يرجى التحقق من تفاصيل البطاقة أو استخدام بطاقة أخرى."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={() => window.history.back()}
          className="flex-1 bg-deep-navy text-white font-jakarta font-semibold py-3.5 px-6 rounded-xl hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 text-sm"
        >
          {locale === "en" ? "Try Again" : "إعادة المحاولة"}
        </button>
        <Link
          href="/contact"
          className="flex-1 border border-outline-variant text-deep-navy font-jakarta font-semibold py-3.5 px-6 rounded-xl hover:bg-sand-beige transition-all duration-300 text-sm"
        >
          {locale === "en" ? "Contact Support" : "تواصل مع الدعم"}
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-background pt-28 pb-16 flex items-center justify-center px-4">
        <Suspense fallback={<div className="text-deep-navy font-jakarta">Loading...</div>}>
          <PaymentFailedContent />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
