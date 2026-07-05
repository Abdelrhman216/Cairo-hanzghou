"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PublicLayout from "@/components/layout/PublicLayout";
import { cn } from "@/lib/utils";
import PackageCard from "@/components/cards/PackageCard";
import EmptyState from "@/components/ui/EmptyState";
import { useTranslation } from "@/components/layout/I18nProvider";

const CONTINENT_FILTERS = ["All", "Africa", "Asia", "Europe", "Americas"];

const localizedFilters: Record<string, Record<string, string>> = {
  en: {
    All: "All",
    Africa: "Africa",
    Asia: "Asia",
    Europe: "Europe",
    Americas: "Americas",
  },
  ar: {
    All: "الكل",
    Africa: "أفريقيا",
    Asia: "آسيا",
    Europe: "أوروبا",
    Americas: "الأمريكتان",
  },
};

import { getPackages } from "@/services/packages";

export default function PackagesClientPage() {
  const { locale, dir, t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [pkgs, setPkgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isRtl = dir === "rtl";

  useEffect(() => {
    async function loadPackages() {
      setLoading(true);
      try {
        const data = await getPackages(locale);
        setPkgs(data ?? []);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, [locale]);

  const filtered = useMemo(() => {
    return pkgs.filter((p) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Americas") {
        return p.continent.includes("America");
      }
      return p.continent.includes(activeFilter) || p.destinationLabel.includes(activeFilter);
    });
  }, [pkgs, activeFilter]);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative h-64 md:h-80 overflow-hidden" aria-label="Packages cover banner">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZRZiX9Id_TakubrgI7F4G90XQIulJHai72DrL_qRYiHRgPch5jWjQmcw1JWnNKUihwfRTaDuq-yzk1mbZgsby8Vp-O3BeTH1AKnjCZmfyJ1pRO-KsbfUyiJMz0v_PpPxPNn_yJ_C3zD6CC6FYra2DmKXK7jSr7gu3looUfHWcOhSrhkoJcDDB11gcj_Rtv3Ovt4CA-Z5tGxWkl056yZBdZNocR1cyqc1uI86oGuRb1ztrc_epf_SATmf89CfC-IstAS49Wi-Bcz4"
          alt="Bespoke luxury travel packages across all continents"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-deep-navy/60" />
        <div className="absolute inset-0 flex flex-col justify-end max-w-[1280px] mx-auto px-5 lg:px-16 pb-10 z-10">
          <nav className={cn("flex items-center gap-2 mb-3", isRtl && "flex-row-reverse justify-end")} aria-label="Breadcrumb">
            <Link href="/" className="text-white/60 text-label-sm font-jakarta hover:text-white transition-colors">
              {locale === "en" ? "Home" : "الرئيسية"}
            </Link>
            <span className={cn("material-symbols-outlined text-white/40 text-sm", isRtl && "rotate-180")}>chevron_right</span>
            <span className="text-white text-label-sm font-jakarta font-semibold">
              {locale === "en" ? "Packages" : "البرامج السياحية"}
            </span>
          </nav>
          <h1 className={cn("font-caslon text-display-lg-mobile md:text-headline-lg text-white", isRtl && "text-right")}>
            {locale === "en" ? "Curated Global Packages" : "برامج سياحية عالمية منتقاة"}
          </h1>
          <p className={cn("font-jakarta text-white/80 text-body-md mt-2 max-w-xl", isRtl && "text-right")}>
            {locale === "en" 
              ? "Bespoke journeys across every continent — crafted for the most discerning travelers worldwide."
              : "رحلات مصممة خصيصاً عبر كل القارات — صُنعت لأصحاب الذوق الرفيع من المسافرين حول العالم."}
          </p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-5 lg:px-16 py-12">
        {/* Continent Filters */}
        <div className={cn("flex items-center gap-3 mb-10 flex-wrap", isRtl && "flex-row-reverse justify-end")} role="group" aria-label="Filter packages by continent">
          {CONTINENT_FILTERS.map((f) => {
            const filterName = localizedFilters[locale]?.[f] || f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-6 py-2.5 rounded font-jakarta font-semibold text-label-lg transition-all duration-300",
                  activeFilter === f
                    ? "bg-deep-navy text-white shadow-luxury"
                    : "bg-sand-beige text-deep-navy hover:bg-champagne-gold/20 hover:text-champagne-gold"
                )}
                aria-pressed={activeFilter === f}
              >
                {filterName}
              </button>
            );
          })}
        </div>

        {/* Package Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="w-8 h-8 border-2 border-champagne-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length > 0 ? (
            <motion.div
              key="grid"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {filtered.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} index={i} />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              key="empty"
              title={locale === "en" ? "No Packages Available" : "لا توجد برامج متاحة"}
              description={locale === "en" 
                ? `We currently don't have scheduled travel packages for ${activeFilter}. Contact our architects to build a custom trip.`
                : `لا تتوفر حالياً برامج سياحية مجدولة لقارة ${localizedFilters[locale]?.[activeFilter] || activeFilter}. اتصل بمصممي الرحلات لدينا لبناء رحلة مخصصة.`}
              actionLabel={locale === "en" ? "Create Custom Journey" : "صمم رحلة مخصصة"}
              onAction={() => {
                const element = document.getElementById("contact-section");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            />
          )}
        </AnimatePresence>

        {/* Custom Package CTA Section */}
        <motion.div
          id="contact-section"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={cn("mt-20 bg-sand-beige rounded-xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8", isRtl && "md:flex-row-reverse text-right")}
        >
          <div className={isRtl ? "text-right" : "text-left"}>
            <p className="font-jakarta text-label-lg text-champagne-gold tracking-widest uppercase mb-3">
              {locale === "en" ? "Custom Journey" : "رحلة خاصة مخصصة"}
            </p>
            <h2 className="font-caslon text-headline-lg text-deep-navy mb-3">
              {locale === "en" ? "Can't find what you're looking for?" : "لم تجد ما تبحث عنه بالظبط؟"}
            </h2>
            <p className="font-jakarta text-body-md text-on-surface-variant max-w-lg">
              {locale === "en" 
                ? "Our travel architects will craft a completely bespoke itinerary tailored to your vision, timeline, and preferences."
                : "سيقوم مهندسو وخبراء السفر لدينا بتصميم برنامج رحلة مخصص بالكامل يتناسب مع رؤيتك وجدولك الزمني وتفضيلاتك الشخصية."}
            </p>
          </div>
          <Link
            href="/#contact"
            className="shrink-0 bg-deep-navy text-white font-jakarta font-bold px-10 py-4 rounded hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95 whitespace-nowrap"
          >
            {locale === "en" ? "Request Custom Package" : "طلب برنامج رحلة خاص"}
          </Link>
        </motion.div>
      </div>
    </PublicLayout>
  );
}
