"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "@/components/layout/I18nProvider";

export default function PaymentStatusPage() {
  const { locale } = useTranslation();
  const [searchTx, setSearchTx] = useState("");
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    if (searchTx.trim()) {
      setResult({
        id: searchTx,
        status: "Completed",
        amount: "144,500",
        currency: "EGP",
        date: "2026-07-23",
        service: "Japan Sakura Trail Tour Package",
        gateway: "Paymob / Egyptian Payment Gateway",
      });
    } else {
      setResult(null);
    }
  };

  return (
    <PublicLayout>
      <section className="bg-deep-navy text-white pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16 text-center">
          <p className="font-jakarta text-label-sm text-champagne-gold uppercase tracking-[0.2em] font-bold mb-3">
            {locale === "en" ? "Verification Portal" : "بوابة التحقق"}
          </p>
          <h1 className="font-caslon text-display-md text-white mb-4">
            {locale === "en" ? "Payment Status Lookup" : "استعلام عن حالة الدفع"}
          </h1>
          <p className="font-jakarta text-body-md text-white/70 max-w-xl mx-auto">
            {locale === "en"
              ? "Verify your payment transaction status in Egyptian Pounds (EGP) using your reference number."
              : "تحقق من حالة معاملة الدفع بالجنيه المصري باستخدام رقم المرجع الخاص بك."}
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-[800px] mx-auto px-5">
          <div className="bg-white rounded-2xl p-8 shadow-luxury-lg border border-outline-variant/20 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={searchTx}
                onChange={(e) => setSearchTx(e.target.value)}
                placeholder={locale === "en" ? "Enter Transaction Reference (e.g. CH-PAY-123456)" : "أدخل مرجع المعاملة"}
                className="flex-1 px-4 py-3.5 rounded-xl border border-outline-variant bg-surface text-sm font-jakarta focus:outline-none focus:border-champagne-gold text-deep-navy"
                required
              />
              <button
                type="submit"
                className="bg-deep-navy hover:bg-champagne-gold hover:text-deep-navy text-white font-jakarta font-bold px-8 py-3.5 rounded-xl transition-all duration-300"
              >
                {locale === "en" ? "Check Status" : "تحقق الان"}
              </button>
            </form>
          </div>

          {searched && result && (
            <div className="bg-white rounded-2xl p-8 shadow-luxury-lg border border-outline-variant/20 space-y-4 font-jakarta text-deep-navy">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                <h3 className="font-caslon text-xl font-bold">{result.service}</h3>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {result.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-outline block mb-1">Transaction Ref:</span>
                  <span className="font-bold">{result.id}</span>
                </div>
                <div>
                  <span className="text-outline block mb-1">Amount Paid:</span>
                  <span className="font-bold text-champagne-gold text-sm">EGP {result.amount}</span>
                </div>
                <div>
                  <span className="text-outline block mb-1">Date:</span>
                  <span>{result.date}</span>
                </div>
                <div>
                  <span className="text-outline block mb-1">Payment Gateway:</span>
                  <span>{result.gateway}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
