"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/components/layout/I18nProvider";

const footerTranslations = {
  en: {
    tagline: "Curating bespoke journeys between the majestic heritage of the Nile and the poetic serenity of the West Lake.",
    categories: {
      Destinations: "Destinations",
      Services: "Services",
      Company: "Company",
    },
    links: {
      "Egypt Packages": "Egypt Packages",
      "China Packages": "China Packages",
      "Dual Civilization": "Dual Civilization",
      "Nile Cruises": "Nile Cruises",
      "Flight Booking": "Flight Booking",
      "Hotel Reservations": "Hotel Reservations",
      "Visa Center": "Visa Center",
      "Concierge": "Concierge",
      "Our Story": "Our Story",
      "Why Us": "Why Us",
      "Testimonials": "Testimonials",
      "Contact": "Contact Us",
      "Privacy Policy": "Privacy Policy",
      "Terms & Conditions": "Terms & Conditions",
      "Refund Policy": "Refund Policy",
      "Cancellation Policy": "Cancellation Policy",
      "Shipping Policy": "Shipping & Delivery Policy",
    },
    taglineBottom: "Visa Consultancy & Travel Services — All Payments Processed in EGP Only",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    copyright: "© {year} Cairo Hangzhou. All rights reserved.",
  },
  ar: {
    tagline: "تصميم رحلات مخصصة تربط بين التراث المهيب لنهر النيل والجمال الشاعري لبحيرة غرب هانغتشو.",
    categories: {
      Destinations: "الوجهات السياحية",
      Services: "خدماتنا",
      Company: "الشركة",
    },
    links: {
      "Egypt Packages": "برامج سياحة مصر",
      "China Packages": "برامج سياحة الصين",
      "Dual Civilization": "الحضارة المزدوجة",
      "Nile Cruises": "رحلات الكروز النيلية",
      "Flight Booking": "حجوزات الطيران",
      "Hotel Reservations": "حجوزات الفنادق",
      "Visa Center": "مركز التأشيرات",
      "Concierge": "الكونسيرج الشخصي",
      "Our Story": "قصتنا وتاريخنا",
      "Why Us": "لماذا تختارنا",
      "Testimonials": "تجارب وآراء العملاء",
      "Contact": "اتصل بنا",
      "Privacy Policy": "سياسة الخصوصية",
      "Terms & Conditions": "الشروط والأحكام",
      "Refund Policy": "سياسة الاسترداد",
      "Cancellation Policy": "سياسة الإلغاء",
      "Shipping Policy": "سياسة الشحن والتسليم",
    },
    taglineBottom: "استشارات التأشيرات وخدمات السفر العالمية — جميع المدفوعات بالجنيه المصري فقط",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    copyright: "© {year} القاهرة هانغتشو. جميع الحقوق محفوظة.",
  },
};

export default function Footer() {
  const { locale } = useTranslation();
  const tFooter = footerTranslations[locale] || footerTranslations.en;
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch(() => setSettings(null));
  }, []);

  const company = settings?.company ?? {};
  const footer = settings?.footer ?? {};
  const footerLinks = footer.links ?? {};
  const socialLinks = [
    { icon: "location_on", label: "14 EL-AHRAR STREET, ELDOKKII", labelAr: "14 شارع الأحرار، الدقي", href: "/contact" },
    { icon: "mail", label: "info@cairohangzhou.com", labelAr: "info@cairohangzhou.com", href: "mailto:info@cairohangzhou.com" },
    { icon: "phone", label: "+20 114 942 2491", labelAr: "+20 114 942 2491", href: "tel:+201149422491" },
  ];

  return (
    <footer className="bg-deep-navy text-white" role="contentinfo">
      {/* Main Footer */}
      <div className="max-w-[1280px] mx-auto px-5 lg:px-16 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex flex-col mb-6">
              <p className="font-caslon font-bold text-xl tracking-[0.2em] text-white">
                CAIRO HANGZHOU
              </p>
              <div className="w-12 h-0.5 bg-champagne-gold mt-2" />
            </Link>
            <p className="font-jakarta text-white/70 leading-relaxed mb-8 max-w-xs text-sm">
              {tFooter.tagline}
              {footer.tagline || tFooter.tagline}
            </p>

            {/* Contact */}
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 text-white/60 hover:text-champagne-gold transition-colors duration-300 group"
                  aria-label={link.label}
                >
                  <span className="material-symbols-outlined text-base text-champagne-gold/60 group-hover:text-champagne-gold transition-colors">
                    {link.icon}
                  </span>
                  <span className="font-jakarta text-sm">
                    {locale === "en" ? link.label : link.labelAr}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-jakarta font-semibold text-label-lg tracking-[0.1em] text-champagne-gold uppercase mb-6">
                {tFooter.categories[category as keyof typeof tFooter.categories] || category}
              </h3>
              <ul className="space-y-3" role="list">
                {(links as any[]).map((link: any) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-jakarta text-sm text-white/60 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block transition-transform"
                    >
                      {tFooter.links[link.label as keyof typeof tFooter.links] || link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Visa Tagline */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-px h-8 bg-champagne-gold" aria-hidden="true" />
            <p className="font-jakarta text-sm text-white/50 tracking-[0.05em] uppercase">
              {footer.taglineBottom || tFooter.taglineBottom}
            </p>
          </div>

          {/* Bottom links */}
          <div className="flex items-center gap-6 text-white/40 text-xs font-jakarta">
            <span>
              {tFooter.copyright.replace("{year}", String(new Date().getFullYear()))}
            </span>
            <span aria-hidden="true">·</span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors duration-300">
              {tFooter.privacy}
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">
              {tFooter.terms}
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors duration-300">
              {locale === "en" ? "Refund Policy" : "سياسة الاسترداد"}
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/cancellation-policy" className="hover:text-white transition-colors duration-300">
              {locale === "en" ? "Cancellation Policy" : "سياسة الإلغاء"}
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/shipping-policy" className="hover:text-white transition-colors duration-300">
              {locale === "en" ? "Delivery Policy" : "سياسة التسليم"}
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="h-1 bg-gold-gradient" aria-hidden="true" />
    </footer>
  );
}
