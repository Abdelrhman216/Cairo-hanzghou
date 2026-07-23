"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "@/components/layout/I18nProvider";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const txId = searchParams.get("tx") || "CH-PAY-" + Math.floor(100000 + Math.random() * 900000);
  const amount = searchParams.get("amount") || "144,500";
  const { locale } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-8 lg:p-12 max-w-xl w-full text-center shadow-luxury-lg border border-outline-variant/20 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6">
        <span className="material-symbols-outlined text-4xl">check_circle</span>
      </div>

      <h1 className="font-caslon text-display-sm text-deep-navy mb-2">
        {locale === "en" ? "Payment Successful!" : "تم الدفع بنجاح!"}
      </h1>
      <p className="font-jakarta text-sm text-champagne-gold font-bold uppercase tracking-widest mb-6">
        {locale === "en" ? "Transaction Ref: " : "مرجع المعاملة: "}{txId}
      </p>

      <div className="bg-sand-beige w-full rounded-xl p-4 mb-6 text-left space-y-2 font-jakarta text-xs text-deep-navy">
        <div className="flex justify-between">
          <span className="text-outline">{locale === "en" ? "Amount Paid:" : "المبلغ المدفوع:"}</span>
          <span className="font-bold text-sm">EGP {amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-outline">{locale === "en" ? "Currency:" : "العملة:"}</span>
          <span className="font-semibold">Egyptian Pounds (EGP)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-outline">{locale === "en" ? "Status:" : "الحالة:"}</span>
          <span className="text-green-700 font-bold uppercase">Completed</span>
        </div>
      </div>

      <p className="font-jakarta text-body-md text-on-surface-variant mb-8 leading-relaxed">
        {locale === "en"
          ? "Thank you for your payment. Your reservation has been confirmed and a official receipt has been emailed to you."
          : "شكراً لمدفوعاتك. تم تأكيد حجزك وإرسال إيصال رسمي إلى بريدك الإلكتروني."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href="/profile"
          className="flex-1 bg-deep-navy text-white font-jakarta font-semibold py-3.5 px-6 rounded-xl hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 text-sm"
        >
          {locale === "en" ? "View My Bookings" : "عرض حجوزاتي"}
        </Link>
        <Link
          href="/"
          className="flex-1 border border-outline-variant text-deep-navy font-jakarta font-semibold py-3.5 px-6 rounded-xl hover:bg-sand-beige transition-all duration-300 text-sm"
        >
          {locale === "en" ? "Back to Home" : "العودة للرئيسية"}
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-background pt-28 pb-16 flex items-center justify-center px-4">
        <Suspense fallback={<div className="text-deep-navy font-jakarta">Loading...</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
