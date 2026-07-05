"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PublicLayout from "@/components/layout/PublicLayout";
import { submitTravelRequest } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { type TravelPackage } from "@/lib/data";
import { useTranslation } from "@/components/layout/I18nProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

import { getPackage } from "@/services/packages";

export default function PackageDetailClient({ pkg }: { pkg: TravelPackage }) {
  const { locale, dir, t } = useTranslation();
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [bookedRequest, setBookedRequest] = useState<{ id: string; title: string } | null>(null);

  const [localizedPkg, setLocalizedPkg] = useState<TravelPackage>(pkg);

  const isRtl = dir === "rtl";

  useEffect(() => {
    async function loadDetails() {
      try {
        const found = await getPackage(pkg.id, locale);
        if (found) {
          setLocalizedPkg(found);
        }
      } catch (err) {
        console.error("Failed to load localized package:", err);
      }
    }
    loadDetails();
  }, [locale, pkg.id]);

  const handleBookPackage = async (e: React.MouseEvent) => {
    e.preventDefault();
    const detailsStr = `Package: ${localizedPkg.title}. Subtitle: ${localizedPkg.subtitle}. Destination: ${localizedPkg.destinationLabel}. Duration: ${localizedPkg.duration}. Group Size: ${localizedPkg.groupSize}. Travel Date: ${travelDate || "Not specified"}. Passengers: ${passengers}. Highlights: ${localizedPkg.highlights.join(", ")}.`;
    const price = localizedPkg.price * passengers;

    try {
      const result = await submitTravelRequest({
      customerName: "Ahmed Al-Hassan",
      email: "customer@cairohangzhou.com",
      phone: "+20 100 123 4567",
      type: "package",
      title: localizedPkg.title,
      details: detailsStr,
      amount: price,
      });

      setBookedRequest({
        id: result.id,
        title: localizedPkg.title,
      });
    } catch {
      alert("Failed to submit package request.");
    }
  };

  // Localized tag
  let displayTag = localizedPkg.tag;
  if (locale === "ar") {
    if (pkg.tag === "Best Seller") displayTag = "الأكثر مبيعاً";
    else if (pkg.tag === "Ancient Wonders") displayTag = "عجائب قديمة";
    else if (pkg.tag === "New") displayTag = "جديد";
    else if (pkg.tag === "Premium Journey") displayTag = "رحلة مميزة";
  }

  // Localized duration / group
  let displayDuration = localizedPkg.duration;
  let displayGroup = localizedPkg.groupSize;
  if (locale === "ar") {
    displayDuration = localizedPkg.duration.replace("days", "أيام").replace("nights", "ليالي");
    displayGroup = localizedPkg.groupSize.replace("up to", "حتى").replace("people", "أشخاص");
  }

  return (
    <>
      <PublicLayout>
        {/* Hero cover section */}
        <div className="relative h-80 md:h-[500px] overflow-hidden">
          <Image
            src={localizedPkg.image}
            alt={localizedPkg.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-deep-navy/50 z-10" />
          <div className="absolute inset-0 flex flex-col justify-end max-w-[1280px] mx-auto px-5 lg:px-16 pb-12 z-20">
            <nav className={cn("flex items-center gap-2 mb-3", isRtl && "flex-row-reverse justify-end")} aria-label="Breadcrumb">
              <Link href="/" className="text-white/60 text-label-sm font-jakarta hover:text-white transition-colors">
                {locale === "en" ? "Home" : "الرئيسية"}
              </Link>
              <span className={cn("material-symbols-outlined text-white/40 text-sm", isRtl && "rotate-180")}>chevron_right</span>
              <Link href="/packages" className="text-white/60 text-label-sm font-jakarta hover:text-white transition-colors">
                {locale === "en" ? "Packages" : "البرامج السياحية"}
              </Link>
              <span className={cn("material-symbols-outlined text-white/40 text-sm", isRtl && "rotate-180")}>chevron_right</span>
              <span className="text-white text-label-sm font-jakarta">{localizedPkg.title}</span>
            </nav>
            <span className={cn("px-3 py-1 rounded text-label-sm font-bold w-fit mb-3 shadow-luxury", pkg.tagColor === "gold" ? "bg-champagne-gold text-deep-navy" : "bg-white/20 text-white")}>
              {displayTag}
            </span>
            <h1 className={cn("font-caslon text-display-lg-mobile md:text-headline-lg text-white", isRtl && "text-right")}>{localizedPkg.title}</h1>
            <p className={cn("font-jakarta text-white/80 mt-2 max-w-xl", isRtl && "text-right")}>{localizedPkg.subtitle}</p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-5 lg:px-16 py-12">
          <div className={cn("grid grid-cols-1 gap-8", isRtl ? "lg:grid-cols-[1fr,350px]" : "lg:grid-cols-[2fr,1fr]")}>
            
            {/* Main Content */}
            <div className={cn("space-y-8", isRtl ? "order-2 text-right" : "order-1 text-left")}>
              {/* Quick Info Grid */}
              <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className={cn("flex flex-wrap gap-6", isRtl && "flex-row-reverse justify-start")}>
                {[
                  { icon: "schedule", label: locale === "en" ? "Duration" : "مدة الرحلة", value: displayDuration },
                  { icon: "group", label: locale === "en" ? "Group Size" : "حجم المجموعة", value: displayGroup },
                  { icon: "public", label: locale === "en" ? "Destination" : "الوجهة", value: localizedPkg.destinationLabel },
                  { icon: "star", label: locale === "en" ? "Rating" : "التقييم", value: `${localizedPkg.rating} (${localizedPkg.reviews} ${locale === "en" ? "reviews" : "تقييم"})` },
                ].map((info, i) => (
                  <motion.div key={info.label} variants={fadeUp} custom={i} className={cn("flex items-center gap-3", isRtl && "flex-row-reverse text-right")}>
                    <div className="w-10 h-10 bg-sand-beige rounded-xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-champagne-gold text-base">{info.icon}</span>
                    </div>
                    <div>
                      <p className="font-jakarta text-label-sm text-outline">{info.label}</p>
                      <p className="font-jakarta font-semibold text-sm text-deep-navy">{info.value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Highlights */}
              <div className="bg-white rounded-xl p-8 shadow-luxury border border-outline-variant/10">
                <h2 className="font-caslon text-headline-lg text-deep-navy mb-6">
                  {locale === "en" ? "Package Highlights" : "أبرز مميزات البرنامج"}
                </h2>
                <div className="space-y-3">
                  {localizedPkg.highlights.map((h) => (
                    <div key={h} className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                      <div className="w-6 h-6 bg-champagne-gold/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-champagne-gold text-sm">check</span>
                      </div>
                      <span className="font-jakarta text-body-md text-on-surface">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-white rounded-xl p-8 shadow-luxury border border-outline-variant/10">
                <h2 className="font-caslon text-headline-lg text-deep-navy mb-6">
                  {locale === "en" ? "What's Included" : "مشتملات البرنامج"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {localizedPkg.includes.map((item) => (
                    <div key={item} className={cn("flex items-center gap-3 p-3 rounded-xl bg-sand-beige", isRtl && "flex-row-reverse text-right")}>
                      <span className="material-symbols-outlined text-champagne-gold text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="font-jakarta font-semibold text-sm text-deep-navy">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className={cn("self-start", isRtl ? "order-1 lg:sticky lg:top-28" : "order-2 lg:sticky lg:top-28")}>
              <div className="bg-white rounded-xl p-8 shadow-luxury-lg border border-outline-variant/20">
                <div className={isRtl ? "text-right" : "text-left"}>
                  <p className="font-jakarta text-label-sm text-outline line-through mb-1">${localizedPkg.originalPrice.toLocaleString()} {locale === "en" ? "per person" : "للشخص الواحد"}</p>
                  <p className="font-caslon text-display-lg-mobile text-champagne-gold">${localizedPkg.price.toLocaleString()}</p>
                  <p className="font-jakarta text-label-sm text-outline">
                    {locale === "en" ? "per person" : "للشخص الواحد"}
                  </p>
                  <div className={cn("mt-2 px-3 py-1 bg-green-100 text-green-700 rounded text-label-sm font-bold w-fit", isRtl && "mr-0 ml-auto")}>
                    {locale === "en" ? `Save $${(pkg.originalPrice - pkg.price).toLocaleString()}` : `وفر ${(pkg.originalPrice - pkg.price).toLocaleString()} $`}
                  </div>
                </div>

                {/* Form Input fields */}
                <div className="space-y-4 mb-6 mt-6">
                  <div className="space-y-1.5">
                    <label htmlFor="travel-date" className={cn("font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block", isRtl && "text-right")}>
                      {locale === "en" ? "Travel Date" : "تاريخ السفر"}
                    </label>
                    <input
                      id="travel-date"
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className={cn("w-full border border-outline-variant rounded px-4 py-3 font-jakarta text-sm focus:outline-none focus:border-champagne-gold transition-colors bg-white", isRtl && "text-right")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="passengers-select" className={cn("font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block", isRtl && "text-right")}>
                      {locale === "en" ? "Passengers" : "المسافرون"}
                    </label>
                    <select
                      id="passengers-select"
                      value={passengers}
                      onChange={(e) => setPassengers(Number(e.target.value))}
                      className={cn(
                        "w-full border border-outline-variant rounded px-4 py-3 font-jakarta text-sm focus:outline-none focus:border-champagne-gold transition-colors appearance-none bg-white",
                        isRtl ? "text-right pr-4 pl-10" : "text-left pl-4 pr-10"
                      )}
                      aria-label="Number of passengers"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>
                          {locale === "en" ? `${n} Passenger${n > 1 ? "s" : ""}` : `${n} مسافر`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleBookPackage}
                  className="w-full bg-deep-navy text-white font-jakarta font-bold py-4 rounded text-center block hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95 mb-3"
                >
                  {locale === "en" ? "Book This Package" : "حجز هذا البرنامج"}
                </button>
                <button 
                  onClick={() => alert(locale === "en" ? "Custom quote request coming soon." : "طلب تسعير خاص قريباً.")}
                  className="w-full border border-outline-variant text-deep-navy font-jakarta font-semibold py-3.5 rounded hover:bg-sand-beige transition-all duration-300"
                >
                  {locale === "en" ? "Request Custom Quote" : "طلب تسعير خاص"}
                </button>

                <div className="mt-6 pt-6 border-t border-outline-variant/30 space-y-3">
                  {(locale === "en" 
                    ? ["Free cancellation up to 7 days before", "Instant confirmation", "24/7 Support"]
                    : ["إلغاء مجاني حتى 7 أيام قبل السفر", "تأكيد فوري للطلب", "دعم مباشر على مدار الساعة"]
                  ).map((b) => (
                    <div key={b} className={cn("flex items-center gap-2 text-label-sm font-jakarta text-on-surface-variant", isRtl && "flex-row-reverse")}>
                      <span className="material-symbols-outlined text-champagne-gold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>

      {/* Success Booking Modal */}
      <AnimatePresence>
        {bookedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-deep-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setBookedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-luxury-lg border border-outline-variant/20 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h2 className="font-caslon text-headline-lg text-deep-navy mb-2">
                {locale === "en" ? "Package Request Received" : "تم استلام طلب حجز البرنامج بنجاح"}
              </h2>
              <p className="font-jakarta text-label-sm text-champagne-gold font-bold uppercase tracking-wider mb-4">
                {locale === "en" ? "ID: " : "مرجع الطلب: "}{bookedRequest.id}
              </p>
              <p className="font-jakarta text-body-md text-on-surface-variant mb-6 leading-relaxed">
                {locale === "en" 
                  ? `Your luxury booking request for ${bookedRequest.title} has been logged. An email confirmation has been generated, and an advisor is reviewing your request.`
                  : `تم تسجيل طلب الحجز الخاص بك لبرنامج ${bookedRequest.title}. تم إرسال إشعار تأكيد بالبريد الإلكتروني، ويقوم مستشار السفر لدينا بمراجعته.`}
              </p>
              <div className="flex gap-3 w-full">
                <Link
                  href="/profile"
                  className="flex-1 bg-deep-navy text-white font-jakarta font-semibold py-3 px-6 rounded text-center hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 text-sm"
                >
                  {locale === "en" ? "View My Bookings" : "عرض حجوزاتي"}
                </Link>
                <button
                  onClick={() => setBookedRequest(null)}
                  className="flex-1 border border-outline-variant text-deep-navy font-jakarta font-semibold py-3 px-6 rounded hover:bg-sand-beige transition-all duration-300 text-sm"
                >
                  {locale === "en" ? "Close" : "إغلاق"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
