"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import PublicLayout from "@/components/layout/PublicLayout";
import DestinationCard from "@/components/cards/DestinationCard";
import { useTranslation } from "@/components/layout/I18nProvider";
import { cn } from "@/lib/utils";

// --- Animation variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function HomeClientPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [searchQuery, setSearchQuery] = useState("");
  const { locale, dir, t } = useTranslation();

  const isRtl = dir === "rtl";

  const [homeContent, setHomeContent] = useState<any>({
    settings: {},
    company: {},
    stats: [],
    testimonials: [],
    shortcuts: [],
    services: [],
    destinations: [],
  });
  const [dests, setDests] = useState<any[]>([]);
  const [loadingDests, setLoadingDests] = useState(true);

  useEffect(() => {
    async function loadHomeContent() {
      setLoadingDests(true);
      try {
        const res = await fetch(`/api/content/home?lang=${locale}`, { cache: "no-store" });
        const data = await res.json();
        setHomeContent(data);
        setDests(data.destinations ?? []);
      } catch (err) {
        console.error("Failed to load homepage content:", err);
      } finally {
        setLoadingDests(false);
      }
    }
    loadHomeContent();
  }, [locale]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/packages?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Localized testomonials mapping
  const localizedTestimonials = useMemo(() => {
    return (homeContent.testimonials ?? []).map((item: any) => {
      let content = item.content;
      let role = item.role;
      let country = item.country;
      if (locale === "ar") {
        if (item.name === "Sarah Al-Mansouri") {
          content = "رتبت لي القاهرة هانغتشو جولة أعمالي في آسيا بالكامل — اليابان، سنغافورة، وكوريا الجنوبية — بلا أخطاء. تنسيق التأشيرات وحده وفر عليّ أسابيع من المعاملات الورقية. خدمة استثنائية.";
          role = "مسافرة أعمال";
          country = "الإمارات";
        } else if (item.name === "James Whitmore") {
          content = "برنامج ملحمة البحر المتوسط كان سحراً خالصاً — من الأكروبوليس إلى الكولوسيوم إلى ساغرادا فاميليا، كانت كل التفاصيل مثالية. خمس نجوم لا توفي حق هذه الخدمة.";
          role = "مسافر ترفيهي";
          country = "المملكة المتحدة";
        } else if (item.name === "Dr. Fatima Al-Rashid") {
          content = "خطط رحلات مخصصة، حجوزات كابينة ممتازة، وانتقالات 5 نجوم. إنهم خياري المفضل المطلق لسفر الشركات والعطلات العائلية على حد سواء.";
          role = "أستاذة جامعية";
          country = "السعودية";
        }
      }
      return { ...item, content, role, country };
    });
  }, [homeContent.testimonials, locale]);

  // Localized shortcuts mapping
  const localizedShortcuts = useMemo(() => {
    return (homeContent.shortcuts ?? []).map((item: any) => {
      let label = item.label;
      let sub = item.sub;
      if (locale === "ar") {
        if (item.label === "Flights") { label = "الرحلات"; sub = "جميع الوجهات"; }
        else if (item.label === "Visa") { label = "التأشيرات"; sub = "أكثر من 195 دولة"; }
        else if (item.label === "Packages") { label = "البرامج السياحية"; sub = "جولات عالمية"; }
        else if (item.label === "Hotels") { label = "الفنادق"; sub = "إقامة فاخرة"; }
        else if (item.label === "Business") { label = "الأعمال"; sub = "سفر الشركات"; }
        else if (item.label === "Education") { label = "التعليم"; sub = "دراسة بالخارج"; }
      }
      return { ...item, label, sub };
    });
  }, [homeContent.shortcuts, locale]);

  // Localized stats mapping
  const localizedStats = useMemo(() => {
    return (homeContent.stats ?? []).map((stat: any) => {
      let label = stat.label;
      if (locale === "ar") {
        if (stat.label === "Happy Travelers") label = t("home.stats.travelers");
        else if (stat.label === "Destinations Served") label = t("home.stats.destinations");
        else if (stat.label === "Visa Success Rate") label = t("home.stats.visaSuccess");
        else if (stat.label === "Years of Excellence") label = t("home.stats.years");
      }
      return { ...stat, label };
    });
  }, [homeContent.stats, locale, t]);

  // Why Us promise localized cards
  const localizedPromise = useMemo(() => {
    const defaultPromise = homeContent.settings?.promiseCards ?? [];
    if (locale === "ar") {
      return [
        { icon: "verified", title: "قبول مضمون للتأشيرات", desc: "نسبة نجاح 99.2% عبر أكثر من 195 دولة مع دعم مخصص للأوراق والملفات" },
        { icon: "public", title: "تغطية عالمية حقيقية", desc: "مكاتب وشركاء وخبراء سفر في كافة القارات الرئيسية" },
        { icon: "workspace_premium", title: "خدمة راقية مخصصة", desc: "خدمة كونسيرج على مدار الساعة طوال رحلتك في أي مكان في العالم" },
        { icon: "security", title: "موثوق ومؤمن بالكامل", desc: "وكالة سفر مرخصة بالكامل تقدم حماية سفر شاملة لجميع الوجهات" },
      ];
    }
    return defaultPromise;
  }, [homeContent.settings, locale]);

  // Dynamic services localized grid
  const localizedServices = useMemo(() => {
    const defaultSvc = (homeContent.services ?? []).map((service: any) => ({
      icon: service.icon,
      title: service.label,
      desc: service.description,
      href: service.href,
    }));
    if (locale === "ar") {
      return [
        { icon: "description", title: "استشارات التأشيرات", desc: "معاملات احترافية لأكثر من 195 دولة بنسبة قبول 99.2%", href: "/visa" },
        { icon: "flight", title: "رحلات طيران ممتازة", desc: "درجات رجال الأعمال والدرجة الأولى عالمياً بأسعار حصرية", href: "/flights" },
        { icon: "history_edu", title: "برامج سياحية", desc: "خطط سفر متعددة الوجهات مصممة خصيصاً للمسافرين المميزين", href: "/packages" },
        { icon: "translate", title: "الترجمة والتوثيق القانوني", desc: "ترجمة معتمدة للمستندات والأوراق بأكثر من 80 لغة", href: "/services" },
        { icon: "school", title: "التعليم والدراسة بالخارج", desc: "تأشيرات الطلاب، التسجيل والقبول الجامعي لجامعات القمة", href: "/services" },
        { icon: "business_center", title: "سفر الأعمال والشركات", desc: "تخطيط سفر الشركات، حزم متعددة المدن وصالات تنفيذية", href: "/services" },
        { icon: "apartment", title: "فنادق فاخرة منتقاة", desc: "فنادق ومنتجعات 5 نجوم تم اختيارها بعناية عبر القارات", href: "/hotels" },
        { icon: "local_shipping", title: "الخدمات اللوجستية والشحن", desc: "خدمات الشحن الدولي السريع للمستندات والطرود والسلع", href: "/services" },
      ];
    }
    return defaultSvc;
  }, [homeContent.services, locale]);

  return (
    <PublicLayout>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[700px] overflow-hidden"
        aria-label="Hero section"
      >
        {/* Parallax Background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <Image
            src={homeContent.settings?.heroImage || "/logo.jpg"}
            alt="Scenic golden sunset landscape representing premium travel destinations"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-deep-navy/50 via-deep-navy/30 to-deep-navy/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/60 via-deep-navy/20 to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col justify-end max-w-[1280px] mx-auto px-5 lg:px-16 pb-24 md:pb-32"
        >
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
            {/* Pre-heading label */}
            <motion.span
              variants={fadeUp}
              custom={0}
              className={cn(
                "inline-block font-jakarta font-semibold text-label-lg text-champagne-gold tracking-[0.3em] uppercase mb-6",
                isRtl && "tracking-normal"
              )}
            >
              {t("home.tagline")}
            </motion.span>

            {/* Main heading */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-caslon text-display-lg-mobile md:text-display-lg text-white leading-tight mb-6"
            >
              {homeContent.settings?.heroTitle || t("home.title1")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="font-jakarta text-body-lg text-white/85 mb-10 max-w-xl leading-relaxed"
            >
              {homeContent.settings?.heroSubtitle || t("home.subtitle")}
            </motion.p>

            {/* Search Bar Form */}
            <motion.div variants={fadeUp} custom={3}>
              <form onSubmit={handleSearchSubmit} className="glass border border-white/20 rounded flex items-center shadow-luxury-lg max-w-2xl group focus-within:border-champagne-gold/40 transition-all duration-300">
                <span className={cn("material-symbols-outlined text-deep-navy/50 text-xl shrink-0", isRtl ? "mr-6 ml-0" : "ml-6 mr-0")}>search</span>
                <label htmlFor="hero-search" className="sr-only">Search destinations</label>
                <input
                  id="hero-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("home.searchPlaceholder")}
                  className="flex-1 bg-transparent border-none outline-none px-4 py-4 font-jakarta text-body-md text-deep-navy placeholder:text-deep-navy/40"
                />
                <button
                  type="submit"
                  className="m-1.5 bg-deep-navy text-white px-8 py-3 rounded font-jakarta font-semibold text-sm hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95 shrink-0"
                >
                  {t("home.searchBtn")}
                </button>
              </form>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className={cn(
              "absolute bottom-8 flex flex-col items-end gap-3",
              isRtl ? "left-8 lg:left-16" : "right-8 lg:right-16"
            )}
            aria-hidden="true"
          >
            <div className="flex gap-2">
              <div className="w-8 h-0.5 bg-champagne-gold" />
              <div className="w-4 h-0.5 bg-white/30" />
              <div className="w-4 h-0.5 bg-white/30" />
            </div>
            <span className={cn("font-jakarta text-label-sm text-white/50 tracking-[0.2em] uppercase", isRtl && "tracking-normal")}>
              {locale === "en" ? "Worldwide" : "وجهات عالمية"}
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── QUICK SHORTCUTS ─────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-16 -mt-16 relative z-20" aria-label="Quick services">
        {localizedShortcuts.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {localizedShortcuts.map((item: any, i: number) => (
              <motion.div key={item.label} variants={fadeUp} custom={i}>
                <Link
                  href={item.href}
                  className={cn(
                    "bg-white rounded-xl p-6 shadow-luxury hover:shadow-luxury-md transition-all duration-300 flex items-center gap-4 cursor-pointer group hover:-translate-y-1",
                    isRtl ? "flex-row-reverse text-right" : "flex-row text-left"
                  )}
                >
                  <div className="w-16 h-16 rounded-xl bg-sand-beige flex items-center justify-center text-champagne-gold group-hover:bg-deep-navy group-hover:text-white transition-all duration-300 shrink-0">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-jakarta font-semibold text-lg md:text-xl text-deep-navy leading-tight">
                      {item.label}
                    </p>
                    <p className="font-jakarta text-label-sm text-outline mt-1 font-medium">
                      {item.sub}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── FEATURED DESTINATIONS ──────────────────────────────────── */}
      <section className="py-20 lg:py-28" aria-label="Featured destinations">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div>
              <motion.p variants={fadeUp} custom={0} className="font-jakarta text-label-lg text-champagne-gold tracking-widest uppercase mb-3">
                {locale === "en" ? "Curated Escapes" : "رحلات منسقة بعناية"}
              </motion.p>
              <h2 className="font-caslon text-headline-lg text-deep-navy">
                {t("home.destinationsTitle")}
              </h2>
              <motion.p variants={fadeUp} custom={2} className="font-jakarta text-body-md text-outline mt-2 max-w-md">
                {locale === "en" ? "Handpicked escapes across six continents for the discerning global traveler." : "ملاذات سياحية مختارة بعناية عبر ست قارات للمسافرين ذوي الذوق الرفيع."}
              </motion.p>
            </div>
            <motion.div variants={fadeUp} custom={3}>
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 text-champagne-gold font-jakarta font-semibold text-label-lg hover:opacity-70 transition-opacity group"
                aria-label="View all destinations"
              >
                {locale === "en" ? "View All" : "عرض الكل"}
                <span className={cn("material-symbols-outlined text-base transition-transform", isRtl ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1")}>
                  arrow_forward
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Horizontal scroll cards */}
        <div className={cn("overflow-x-auto no-scrollbar", isRtl ? "pr-5 lg:pr-16" : "pl-5 lg:pl-16")}>
          {loadingDests ? (
            <div className="py-12 flex justify-center items-center">
              <div className="w-8 h-8 border-2 border-champagne-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex gap-6 pb-4 min-w-max"
            >
              {dests.map((dest: any, i: number) => (
                <DestinationCard key={dest.id} destination={dest} index={i} />
              ))}
              <div className="w-5 lg:w-16 shrink-0" aria-hidden="true" />
            </motion.div>
          )}
        </div>
      </section>

      {/* ── POPULAR OFFERS (Bento Grid) ─────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-16 py-20 lg:py-28" aria-label="Popular offers">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.p variants={fadeUp} custom={0} className="font-jakarta text-label-lg text-champagne-gold tracking-widest uppercase mb-3">
            {locale === "en" ? "Limited Offers" : "عروض لفترة محدودة"}
          </motion.p>
          <h2 className="font-caslon text-headline-lg text-deep-navy mb-10">
            {locale === "en" ? "Popular Offers" : "العروض الأكثر شعبية"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hero Offer Card — spans 2 columns */}
            <motion.div variants={fadeUp} custom={2} className="md:col-span-2">
              <div className="relative h-72 md:h-80 rounded-xl overflow-hidden shadow-luxury-md group">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAe_56eYI0Ruuhoqx-c1xuEE9Bo4gdfuvMEKLMxarHg2JCkQW_3szkZb11H-G-rwogMR48SkNO4Bij2uvCHNkoiAeaTlaumMYIHP1Gn_vDdmfU20Dswsb_Jt5krwikprBVR0hwzkCBIJjNpFMjApbzU45CoRa9A0it-eqRuq8tRpw1vM3JWeGQN85tuuexa6Nb5wtEc2j6CXQeycJmgo6gkHRgLkOz4_K9iGOJ_wKYQr63EflSvEYrfL8l8SZf0xYmkpeT2V23LSE"
                  alt="Egypt & China Ancient Civilization Tour Packages"
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 66vw, 800px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className={cn("absolute inset-0 bg-black/35 flex flex-col justify-end p-8 z-10", isRtl ? "items-start text-right" : "items-start text-left")}>
                  <p className="text-champagne-gold font-jakarta font-semibold text-label-lg uppercase tracking-widest mb-2">
                    {locale === "en" ? "Limited Time" : "لفترة محدودة فقط"}
                  </p>
                  <h3 className="font-caslon text-headline-md text-white mb-2">
                    {locale === "en" ? "Dual Civilization" : "رحلة الحضارة المزدوجة"}
                  </h3>
                  <p className="font-jakarta text-white/80 text-body-md mb-5 max-w-sm">
                    {locale === "en" ? "Experience two ancient worlds — Egypt & China — in one extraordinary 15-day journey." : "اختبر روعة التاريخ بين عالمين قديمين — مصر والصين — في رحلة استثنائية مدتها 15 يوماً."}
                  </p>
                  <Link
                    href="/packages/dual-civilization"
                    className="inline-flex items-center gap-2 bg-champagne-gold text-deep-navy font-jakarta font-bold px-6 py-2.5 rounded hover:bg-white transition-all duration-300 active:scale-95 w-fit text-sm"
                  >
                    {locale === "en" ? "Explore Details" : "عرض التفاصيل"}
                    <span className={cn("material-symbols-outlined text-sm", isRtl && "rotate-180")}>arrow_forward</span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Global Visa Fast-Track Card */}
            <motion.div variants={fadeUp} custom={3}>
              <div className="bg-sand-beige p-8 rounded-xl flex flex-col justify-between shadow-luxury h-72 md:h-80 relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="text-champagne-gold mb-4">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                  </div>
                  <h3 className="font-caslon text-headline-md text-deep-navy mb-2">
                    {locale === "en" ? "Global Visa Fast-Track" : "مستشار التأشيرات العالمي"}
                  </h3>
                  <p className="font-jakarta text-body-md text-on-surface-variant leading-relaxed">
                    {locale === "en" ? "99.2% approval rate across 195+ countries. Expert consultancy, start to finish." : "نسبة قبول بلغت 99.2% لأكثر من 195 دولة. استشارات احترافية من البداية للنهاية."}
                  </p>
                </div>
                <div className="relative z-10">
                  <p className="font-jakarta text-label-sm text-outline uppercase tracking-widest mb-1">
                    {locale === "en" ? "Starting from" : "تبدأ الرسوم من"}
                  </p>
                  <p className="font-caslon text-headline-lg text-champagne-gold font-bold">$25</p>
                  <Link
                    href="/visa"
                    className="mt-4 inline-flex items-center text-sm font-jakarta font-semibold text-deep-navy hover:text-champagne-gold transition-colors duration-300 group"
                  >
                    {locale === "en" ? "Apply now" : "تقدم بطلبك الآن"}
                    <span className={cn("material-symbols-outlined text-sm transition-transform", isRtl ? "group-hover:-translate-x-1 mr-1 rotate-180" : "group-hover:translate-x-1 ml-1")}>arrow_forward</span>
                  </Link>
                </div>

                {/* Decorative background icon */}
                <div className={cn("absolute opacity-[0.07] group-hover:rotate-12 transition-transform duration-700 pointer-events-none", isRtl ? "-left-6 -bottom-6" : "-right-6 -bottom-6")} aria-hidden="true">
                  <span className="material-symbols-outlined text-[140px]">public</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── GLOBAL SERVICES HIGHLIGHT ─────────────────────────────── */}
      <section className="bg-deep-navy/5 py-16 lg:py-24" aria-label="Our global services">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <div className="text-center mb-12">
              <motion.p variants={fadeUp} custom={0} className="font-jakarta text-label-lg text-champagne-gold tracking-widest uppercase mb-3">
                {locale === "en" ? "What We Do" : "ماذا نقدم لعملائنا"}
              </motion.p>
              <h2 className="font-caslon text-headline-lg text-deep-navy">
                {locale === "en" ? "One Platform, Every Service" : "منصة متكاملة، لكل الخدمات"}
              </h2>
              <motion.p variants={fadeUp} custom={2} className="font-jakarta text-body-md text-outline mt-3 max-w-lg mx-auto">
                {locale === "en" ? "From visa applications to luxury hotels, business travel to translation services — we handle the world so you can explore it." : "من طلبات التأشيرة وحجوزات الفنادق الفاخرة، إلى سفر الأعمال والترجمة المعتمدة — نهيئ لك كل التفاصيل لتستمتع بالاكتشاف."}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {localizedServices.map((svc: any, i: number) => (
                <motion.div key={svc.title} variants={fadeUp} custom={i}>
                  <Link
                    href={svc.href}
                    className="bg-white rounded-xl p-6 shadow-luxury hover:shadow-luxury-md transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 group h-full"
                  >
                    <div className="w-12 h-12 rounded bg-sand-beige flex items-center justify-center text-champagne-gold group-hover:bg-deep-navy group-hover:text-white transition-all duration-300">
                      <span className="material-symbols-outlined">{svc.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-jakarta font-bold text-deep-navy mb-1">{svc.title}</h3>
                      <p className="font-jakarta text-label-sm text-outline leading-relaxed">{svc.desc}</p>
                    </div>
                    <span className="text-champagne-gold font-jakarta font-semibold text-label-sm mt-auto inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      {locale === "en" ? "Learn more" : "اقرأ المزيد"} 
                      <span className={cn("material-symbols-outlined text-sm", isRtl && "rotate-180")}>arrow_forward</span>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────── */}
      <section className="bg-deep-navy py-20" aria-label="Company statistics">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {localizedStats.map((stat: any, i: number) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i} className="text-center">
                <div className="w-12 h-12 rounded bg-champagne-gold/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-champagne-gold text-xl">{stat.icon}</span>
                </div>
                <p className="font-caslon text-headline-lg text-champagne-gold font-bold mb-1">
                  {stat.value}
                </p>
                <p className="font-jakarta text-label-sm text-white/60 tracking-wider uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY US ──────────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-16 py-20 lg:py-28" aria-label="Why choose Cairo Hangzhou">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p variants={fadeUp} custom={0} className="font-jakarta text-label-lg text-champagne-gold tracking-widest uppercase mb-3">
                {locale === "en" ? "Our Promise" : "عهدنا وجودة خدماتنا"}
              </motion.p>
              <h2 className="font-caslon text-headline-lg text-deep-navy mb-6">
                {locale === "en" ? "The Cairo Hangzhou Difference" : "فلسفة التميز مع القاهرة هانغتشو"}
              </h2>
              <motion.p variants={fadeUp} custom={2} className="font-jakarta text-body-lg text-on-surface-variant leading-relaxed mb-8">
                {locale === "en"
                  ? "We don't just book trips. We architect transformative journeys — for any country, any purpose, any traveler. Every detail, from your visa to your suite, is curated with the precision of a true global connoisseur."
                  : "نحن لا نكتفي بحجز رحلات السفر فقط. بل نصمم تجارب ملهمة وحكايات سفر استثنائية — لأي بلد، ولأي غرض، ولأي مسافر. كل التفاصيل بدءاً من التأشيرة حتى جناح الإقامة منسقة بدقة وذوق عالمي رفيع."}
              </motion.p>
              <motion.div variants={stagger} className="space-y-4">
                {localizedPromise.map((item: any, i: number) => (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    custom={i + 3}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-sand-beige transition-colors duration-300 group"
                  >
                    <div className="w-10 h-10 rounded bg-champagne-gold/10 flex items-center justify-center shrink-0 group-hover:bg-champagne-gold/20 transition-colors">
                      <span className="material-symbols-outlined text-champagne-gold text-lg">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-jakarta font-bold text-deep-navy text-body-md mb-1">{item.title}</h3>
                      <p className="font-jakarta text-label-sm text-outline">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Image grid */}
            <motion.div variants={fadeUp} custom={3} className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-xl overflow-hidden shadow-luxury-md">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZRZiX9Id_TakubrgI7F4G90XQIulJHai72DrL_qRYiHRgPch5jWjQmcw1JWnNKUihwfRTaDuq-yzk1mbZgsby8Vp-O3BeTH1AKnjCZmfyJ1pRO-KsbfUyiJMz0v_PpPxPNn_yJ_C3zD6CC6FYra2DmKXK7jSr7gu3looUfHWcOhSrhkoJcDDB11gcj_Rtv3Ovt4CA-Z5tGxWkl056yZBdZNocR1cyqc1uI86oGuRb1ztrc_epf_SATmf89CfC-IstAS49Wi-Bcz4"
                    alt="Great Pyramids of Giza at golden hour — Cairo, Egypt"
                    fill
                    sizes="(max-w-768px) 50vw, 300px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-36 rounded-xl overflow-hidden shadow-luxury-md">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHLCcra86FJEIsIzLopb5GlIdxhtCWwGC4rsKoR3a4xujTJE4AmbQ8OyMhZyGIi64T9rWb2qIeQhbn0yBpBChECVrWQDVC1wHu61PZ-62jUVEEvt5e0Y6pyxrzyeTebm5o6IGvvDvYNecmzpNJ1vPWTMImpsMc58jNsMgQ3eiHOfyIqWOHpa-OAYyiT_SsqRKefTEuvj9nAKbohZmkNhoP6ZmzK3iznMgxWDy5uQQlr1XrNHlAYpYl2STuACMnU78Ai-BPjiuVg"
                    alt="Scenic Mediterranean coastal town representing global destinations"
                    fill
                    sizes="(max-w-768px) 50vw, 300px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="relative h-36 rounded-xl overflow-hidden shadow-luxury-md">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2muXSASaCtxjQ9vspnQcQuHYbO9cK2A_LSC6skg-53drf5CDmGjbblGjavkjQDC4L1y3kM119sWICru8Y6S4e_nuePl_eW41DT2TTvwv0KoIXEaTNHlLIbB0eAnKkhN9aELWlTrBd1oKfHEo_WMRTnGimzrxTuJASeFYK9WRP5DTBckysXYI8zhECcN7gsyM_GV3Ludi2oXuEL1eOgvP9jCxtDaVDsU7REZoi6WdjExg2nl6uu5uItubD5lEnF-BJUkcMDMbcpS0"
                    alt="West Lake pavilion shrouded in gentle mist — Hangzhou, China"
                    fill
                    sizes="(max-w-768px) 50vw, 300px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="h-48 rounded-xl overflow-hidden shadow-luxury-md bg-sand-beige flex items-center justify-center">
                  <div className="text-center p-6">
                    <p className="font-caslon text-headline-md text-deep-navy mb-1">195+</p>
                    <p className="font-jakarta text-label-sm text-outline tracking-wider uppercase">
                      {locale === "en" ? "Countries Served" : "دولة وجهة مخدومة"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="bg-sand-beige py-20 lg:py-28" aria-label="Testimonials">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <div className="text-center mb-12">
              <motion.p variants={fadeUp} custom={0} className="font-jakarta text-label-lg text-champagne-gold tracking-widest uppercase mb-3">
                {t("home.testimonialsTitle")}
              </motion.p>
              <h2 className="font-caslon text-headline-lg text-deep-navy">
                {locale === "en" ? "Voices of Discerning Travelers" : "تجارب وآراء عملائنا الكرام"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {localizedTestimonials.map((tItem: any, i: number) => (
                <motion.div
                  key={tItem.name}
                  variants={fadeUp}
                  custom={i}
                  className="bg-white rounded-xl p-8 shadow-luxury hover:shadow-luxury-md transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4" aria-label={`${tItem.rating} stars`}>
                    {Array.from({ length: tItem.rating }).map((_, j) => (
                      <span key={j} className="material-symbols-outlined text-champagne-gold text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-jakarta text-body-md text-on-surface-variant leading-relaxed mb-6 italic">
                    &ldquo;{tItem.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-sand-beige flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-champagne-gold">person</span>
                    </div>
                    <div>
                      <p className="font-jakarta font-bold text-deep-navy text-sm">{tItem.name}</p>
                      <p className="font-jakarta text-label-sm text-outline">{tItem.role} · {tItem.country}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 lg:py-32" aria-label="Call to action">
        <div className="absolute inset-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq_YAuQ57YyhqSqLckh7KI7ydRovhJJdHs8B0mNWUkgvrqhX1Y7-1RdB8-eRGAQT3B57vc2KxVyQaoBiNeQUOU655XTU_TPE9d6RdQsxT_vSGOCg7VbeBY7zXQlNhYRJSLdRSikzE6AqzDETmtY1elZxj24NRlRys8xTEC_KHKUyoJZ9JLTB00jFGM8hWUaTWiX7Ew6BV-F9S-JBvYoSMYn_CE9V1Cfu2Y1AepmCAgegg_twEnbhi4Y7plOYdWJmnjHszn9Q1id6k"
            alt="Scenic global travel background"
            fill
            sizes="100vw"
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-deep-navy/80" />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-16 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} custom={0} className="font-jakarta text-label-lg text-champagne-gold tracking-widest uppercase mb-4">
              {locale === "en" ? "Begin Your Journey" : "ابدأ التخطيط لرحلتك الفريدة"}
            </motion.p>
            <h2 className="font-caslon text-display-lg-mobile md:text-display-lg text-white mb-6">
              {locale === "en" ? "Your World Awaits." : "عالمك ينتظرك."}
              <br />
              <span className="text-champagne-gold">{locale === "en" ? "We Handle Everything." : "نحن نتولى تفاصيل كل شيء."}</span>
            </h2>
            <motion.p variants={fadeUp} custom={2} className="font-jakarta text-body-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
              {locale === "en"
                ? "From visa consultancy to luxury travel across 195+ countries — let us architect every detail of your perfect journey."
                : "من استشارات واستخراج التأشيرة إلى برامج السفر الفاخرة لأكثر من 195 دولة — دعنا نصمم لك تفاصيل رحلتك المثالية."}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/packages"
                className="inline-flex items-center justify-center gap-2 bg-champagne-gold text-deep-navy font-jakarta font-bold px-10 py-4 rounded hover:bg-white transition-all duration-300 active:scale-95 shadow-gold"
              >
                <span className="material-symbols-outlined text-sm">explore</span>
                {locale === "en" ? "Explore Packages" : "استكشف البرامج السياحية"}
              </Link>
              <Link
                href="/visa"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-jakarta font-semibold px-10 py-4 rounded hover:bg-white/10 backdrop-blur-md transition-all duration-300 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">description</span>
                {locale === "en" ? "Apply for Visa" : "التقديم على طلب تأشيرة"}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
