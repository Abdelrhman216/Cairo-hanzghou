"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/layout/I18nProvider";

interface PackageCardProps {
  pkg: any;
  index: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function PackageCard({ pkg, index }: PackageCardProps) {
  const { locale, dir } = useTranslation();
  const isRtl = dir === "rtl";

  // Translate tag if Arabic
  let pkgTag = pkg.tag;
  if (locale === "ar") {
    if (pkg.tag === "Best Seller") pkgTag = "الأكثر مبيعاً";
    else if (pkg.tag === "Ancient Wonders") pkgTag = "عجائب قديمة";
    else if (pkg.tag === "New") pkgTag = "جديد";
    else if (pkg.tag === "Premium Journey") pkgTag = "رحلة مميزة";
  }

  // Translate duration / group size
  let displayDuration = pkg.duration;
  let displayGroup = pkg.groupSize;
  if (locale === "ar") {
    displayDuration = pkg.duration.replace("days", "أيام").replace("nights", "ليالي");
    displayGroup = pkg.groupSize.replace("up to", "حتى").replace("people", "أشخاص");
  }

  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      className="group bg-white rounded-xl shadow-luxury hover:shadow-luxury-md transition-all duration-500 hover:-translate-y-1 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 600px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/40 to-transparent z-10" />
        
        {/* Tag */}
        <span
          className={cn(
            "absolute top-4 px-3 py-1 rounded text-label-sm font-bold uppercase tracking-wider z-20",
            isRtl ? "right-4" : "left-4",
            pkg.tagColor === "gold"
              ? "bg-champagne-gold text-deep-navy"
              : "bg-white/20 backdrop-blur-md text-white"
          )}
        >
          {pkgTag}
        </span>
        
        {/* Rating */}
        <div className={cn("absolute top-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded flex items-center gap-1.5 z-20 shadow-luxury", isRtl ? "left-4" : "right-4")}>
          <span className="material-symbols-outlined text-champagne-gold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="font-jakarta font-bold text-xs text-deep-navy">{pkg.rating}</span>
          <span className="font-jakarta text-xs text-outline">({pkg.reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className={cn("p-6", isRtl ? "text-right" : "text-left")}>
        <div className={cn("flex items-start justify-between gap-4 mb-4", isRtl && "flex-row-reverse text-right")}>
          <div>
            <h2 className="font-caslon text-headline-md text-deep-navy line-clamp-1">{pkg.title}</h2>
            <p className="font-jakarta text-label-sm text-outline mt-1">{pkg.subtitle}</p>
          </div>
          <div className={cn("shrink-0", isRtl ? "text-left" : "text-right")}>
            <p className="font-jakarta text-label-sm text-outline line-through">${pkg.originalPrice.toLocaleString()}</p>
            <p className="font-caslon text-headline-md text-champagne-gold">${pkg.price.toLocaleString()}</p>
            <p className="font-jakarta text-label-sm text-outline">
              {locale === "en" ? "per person" : "للشخص"}
            </p>
          </div>
        </div>

        {/* Meta info */}
        <div className={cn("flex items-center gap-4 mb-5 text-label-sm text-outline font-jakarta flex-wrap", isRtl && "flex-row-reverse")}>
          <span className={cn("flex items-center gap-1", isRtl && "flex-row-reverse")}>
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>{displayDuration}</span>
          </span>
          <span className={cn("flex items-center gap-1", isRtl && "flex-row-reverse")}>
            <span className="material-symbols-outlined text-sm">group</span>
            <span>{displayGroup}</span>
          </span>
          <span className={cn("flex items-center gap-1", isRtl && "flex-row-reverse")}>
            <span className="material-symbols-outlined text-sm">public</span>
            <span>{pkg.destinationLabel}</span>
          </span>
        </div>

        {/* Highlights */}
        <div className={cn("flex flex-wrap gap-2 mb-6", isRtl && "flex-row-reverse justify-start")}>
          {pkg.highlights.slice(0, 3).map((h: string) => (
            <span key={h} className="bg-sand-beige text-deep-navy px-3 py-1 rounded text-label-sm font-jakarta font-medium">
              {h}
            </span>
          ))}
          {pkg.highlights.length > 3 && (
            <span className="bg-surface-container text-outline px-3 py-1 rounded text-label-sm font-jakarta">
              +{pkg.highlights.length - 3} {locale === "en" ? "more" : "إضافي"}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className={cn("flex gap-3", isRtl && "flex-row-reverse")}>
          <Link
            href={`/packages/${pkg.id}`}
            className="flex-1 bg-deep-navy text-white font-jakarta font-semibold text-sm py-3 px-6 rounded text-center hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95"
          >
            {locale === "en" ? "View Details" : "عرض التفاصيل"}
          </Link>
          <button
            className="w-12 h-12 bg-sand-beige rounded flex items-center justify-center text-champagne-gold hover:bg-champagne-gold hover:text-white transition-all duration-300"
            aria-label={locale === "en" ? `Save ${pkg.title} to wishlist` : `حفظ ${pkg.title} في المفضلة`}
          >
            <span className="material-symbols-outlined text-lg">favorite_border</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
