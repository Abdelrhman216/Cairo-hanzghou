"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/layout/I18nProvider";

interface HotelCardProps {
  hotel: any;
  index: number;
  onBook?: (hotel: any) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function HotelCard({ hotel, index, onBook }: HotelCardProps) {
  const { locale, dir } = useTranslation();
  const isRtl = dir === "rtl";

  // Localized category tags
  let displayCategory = hotel.category;
  if (locale === "ar") {
    if (hotel.category === "Ultra-Luxury" || hotel.category === "Ultra Luxury") displayCategory = "فخامة فائقة";
    else if (hotel.category === "Urban Luxury" || hotel.category === "Urban") displayCategory = "فخامة حضرية";
    else if (hotel.category === "Historic Luxury" || hotel.category === "Historic") displayCategory = "فخامة تاريخية";
    else if (hotel.category === "Serenity" || hotel.category === "Wellness") displayCategory = "فخامة هادئة";
  }

  // Localized amenities list
  const localizedAmenities = hotel.amenities.map((a: string) => {
    if (locale === "ar") {
      const trans: Record<string, string> = {
        "Pool": "مسبح",
        "Spa": "سبا فاخر",
        "Fine Dining": "مطعم فاخر",
        "Fitness Center": "مركز رياضي",
        "Concierge": "كونسيرج",
        "Free WiFi": "إنترنت مجاني",
        "Airport Shuttle": "نقل مطار",
        "Bar / Lounge": "صالة لاونج",
        "Beachfront": "مطل على الشاطئ",
        "Private Pool": "مسبح خاص",
        "Scenic Views": "إطلالة بانورامية"
      };
      return trans[a] || a;
    }
    return a;
  });

  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      className="bg-white rounded-xl shadow-luxury hover:shadow-luxury-md transition-all duration-500 overflow-hidden group hover:-translate-y-0.5"
    >
      <div className={cn("flex flex-col md:flex-row", isRtl && "md:flex-row-reverse text-right")}>
        {/* Thumbnail Image */}
        <div className="relative w-full md:w-72 h-52 md:h-auto shrink-0 min-h-[220px]">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            sizes="(max-w-768px) 100vw, 288px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className={cn("absolute top-4 z-10", isRtl ? "right-4" : "left-4")}>
            <span className="bg-champagne-gold text-deep-navy px-3 py-1 rounded text-label-sm font-bold shadow-luxury">
              {displayCategory}
            </span>
          </div>
        </div>

        {/* Info Details */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className={cn("flex items-start justify-between gap-4 mb-3", isRtl && "flex-row-reverse text-right")}>
              <div>
                <div className={cn("flex gap-0.5 mb-2", isRtl && "justify-end")} aria-label={`${hotel.stars} star hotel`}>
                  {Array.from({ length: hotel.stars }).map((_, j) => (
                    <span key={j} className="material-symbols-outlined text-champagne-gold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <h2 className="font-caslon text-headline-md text-deep-navy">{hotel.name}</h2>
                <p className={cn("font-jakarta text-label-sm text-outline flex items-center gap-1 mt-1", isRtl && "flex-row-reverse justify-end")}>
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>{hotel.location}</span>
                </p>
              </div>
              <div className={cn("shrink-0", isRtl ? "text-left" : "text-right")}>
                <p className="font-caslon text-headline-md text-champagne-gold">${hotel.price}</p>
                <p className="font-jakarta text-label-sm text-outline font-medium">
                  {locale === "en" ? "per night" : "لكل ليلة"}
                </p>
              </div>
            </div>
            <p className="font-jakarta text-body-md text-on-surface-variant mb-4 leading-relaxed">{hotel.description}</p>
            
            {/* Amenities list */}
            <div className={cn("flex flex-wrap gap-2 mb-4", isRtl && "flex-row-reverse justify-start")}>
              {localizedAmenities.map((a: string) => (
                <span key={a} className={cn("flex items-center gap-1.5 bg-sand-beige px-3 py-1 rounded text-[11px] font-jakarta font-semibold text-deep-navy", isRtl && "flex-row-reverse")}>
                  <span className="material-symbols-outlined text-champagne-gold text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span>{a}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Review & CTA footer */}
          <div className={cn("flex items-center justify-between gap-4 pt-4 border-t border-outline-variant/10", isRtl && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-2", isRtl && "flex-row-reverse text-right")}>
              <div className="w-8 h-8 bg-deep-navy rounded-lg flex items-center justify-center">
                <span className="font-jakarta font-bold text-white text-xs">{hotel.rating}</span>
              </div>
              <div>
                <p className="font-jakarta font-bold text-deep-navy text-xs">
                  {locale === "en" ? "Excellent" : "ممتاز"}
                </p>
                <p className="font-jakarta text-[11px] text-outline">
                  {hotel.reviews} {locale === "en" ? "reviews" : "تقييم"}
                </p>
              </div>
            </div>
            {onBook && (
              <button
                onClick={() => onBook(hotel)}
                className="bg-deep-navy text-white font-jakarta font-bold px-8 py-3 rounded text-sm hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95"
              >
                {locale === "en" ? "Book Now" : "احجز الآن"}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
