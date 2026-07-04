"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PublicLayout from "@/components/layout/PublicLayout";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { fetchMyTravelRequests } from "@/lib/api-client";
import type { TravelRequest } from "@/lib/server-store";
import { useTranslation } from "@/components/layout/I18nProvider";

const bookingTypeIcon: Record<string, string> = {
  flight: "flight",
  hotel: "apartment",
  package: "history_edu",
  visa: "description",
  custom: "design_services",
};

interface SavedTrip {
  id: string;
  title: string;
  type: string;
  price: number;
  location: string;
  image: string;
}

export default function ProfileClientPage() {
  const { locale, dir, t } = useTranslation();
  const isRtl = dir === "rtl";

  const [activeTab, setActiveTab] = useState("My Bookings");
  const [requests, setRequests] = useState<TravelRequest[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Saved Trips mock list
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([
    { id: "s1", title: "Silk Road Serenity Package", type: "Package", price: 3200, location: "Central Asia / China", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
    { id: "s2", title: "Four Seasons Hotel Cairo", type: "Hotel", price: 420, location: "Cairo, Egypt", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
    { id: "s3", title: "Japan Sakura Trail", type: "Package", price: 4500, location: "Tokyo & Kyoto, Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80" },
  ]);

  // Payment Cards mock list
  const [cards, setCards] = useState([
    { id: "c1", brand: "Visa", last4: "4242", expiry: "12/28", holder: "Ahmed Al-Hassan" },
    { id: "c2", brand: "Mastercard", last4: "8899", expiry: "06/27", holder: "Ahmed Al-Hassan" },
  ]);

  useEffect(() => {
    fetchMyTravelRequests()
      .then(setRequests)
      .catch(() => setRequests([]));
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveSaved = (id: string, name: string) => {
    setSavedTrips(prev => prev.filter(t => t.id !== id));
    triggerToast(
      locale === "en" 
        ? `Removed "${name}" from saved trips` 
        : `تمت إزالة "${name}" من الرحلات المحفوظة`
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(
      locale === "en" 
        ? "Personal profile settings saved successfully!" 
        : "تم حفظ إعدادات ملفك الشخصي بنجاح!"
    );
  };

  const handleDeleteCard = (id: string, last4: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    triggerToast(
      locale === "en" 
        ? `Card ending in ${last4} deleted` 
        : `تم حذف بطاقة الدفع المنتهية بـ ${last4}`
    );
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    triggerToast(
      locale === "en" ? "Logging out..." : "جاري تسجيل الخروج..."
    );
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  // Tabs labels localized
  const tabsList = useMemo(() => {
    return [
      { key: "My Bookings", label: locale === "en" ? "My Bookings" : "حجوزاتي الكلية", icon: "event_available" },
      { key: "Saved Trips", label: locale === "en" ? "Saved Trips" : "الرحلات المحفوظة", icon: "favorite_border" },
      { key: "Visa Applications", label: locale === "en" ? "Visa Applications" : "طلبات التأشيرة", icon: "description" },
      { key: "Payment Methods", label: locale === "en" ? "Payment Methods" : "طرق الدفع المفعلة", icon: "credit_card" },
      { key: "Settings", label: locale === "en" ? "Settings" : "إعدادات الحساب", icon: "settings" },
    ];
  }, [locale]);

  return (
    <>
      <PublicLayout>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16 pt-28 pb-16 lg:pt-36">
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "fixed top-24 z-50 bg-deep-navy text-white px-6 py-3.5 rounded-xl shadow-luxury border border-champagne-gold/30 font-jakarta text-sm flex items-center gap-2",
                  isRtl ? "left-8" : "right-8"
                )}
              >
                <span className="material-symbols-outlined text-champagne-gold text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <div className="bg-white rounded-xl p-8 shadow-luxury text-center border border-outline-variant/10">
                <div className="relative w-24 h-24 rounded-full bg-sand-beige border-4 border-champagne-gold/30 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-champagne-gold text-4xl">person</span>
                </div>
                <h1 className="font-caslon text-headline-md text-deep-navy">Ahmed Al-Hassan</h1>
                <p className="font-jakarta text-label-sm text-outline mt-1 font-semibold">
                  {locale === "en" ? "Premium Member" : "عضو مسافر مميز"}
                </p>
                <div className="w-8 h-0.5 bg-champagne-gold mx-auto my-4" />
                <p className="font-jakarta text-body-md text-on-surface-variant">ahmed.hassan@email.com</p>
                <p className="font-jakarta text-body-md text-on-surface-variant">+20 100 123 4567</p>

                <div className="mt-6 p-4 bg-sand-beige rounded-xl">
                  <p className="font-jakarta text-label-sm text-outline uppercase tracking-wider mb-1">
                    {locale === "en" ? "Loyalty Points" : "نقاط ولاء السفر"}
                  </p>
                  <p className="font-caslon text-headline-md text-champagne-gold">12,840 pts</p>
                </div>
              </div>

              {/* Sidebar Tabs Navigation */}
              <div className="bg-white rounded-xl p-6 shadow-luxury border border-outline-variant/10">
                <h2 className={cn("font-caslon text-headline-md text-deep-navy mb-4", isRtl && "text-right")}>
                  {locale === "en" ? "Account Workspace" : "مساحة إدارة الحساب"}
                </h2>
                <nav className="space-y-1" role="navigation" aria-label="Profile navigation menu">
                  {tabsList.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                        isRtl ? "flex-row-reverse text-right" : "flex-row text-left",
                        activeTab === item.key
                          ? "bg-sand-beige text-champagne-gold"
                          : "text-on-surface-variant hover:bg-sand-beige hover:text-deep-navy"
                      )}
                    >
                      <span className={cn(
                        "material-symbols-outlined text-lg",
                        activeTab === item.key ? "text-champagne-gold" : "text-outline group-hover:text-champagne-gold"
                      )}>{item.icon}</span>
                      <span className="font-jakarta font-semibold text-sm">{item.label}</span>
                    </button>
                  ))}

                  <div className="h-px bg-outline-variant/20 my-2" />

                  {/* Logout Button */}
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-error hover:bg-red-50", isRtl ? "flex-row-reverse text-right" : "flex-row text-left")}
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span className="font-jakarta font-bold text-sm">
                      {locale === "en" ? "Log Out" : "تسجيل الخروج"}
                    </span>
                  </button>
                </nav>
              </div>
            </motion.aside>

            {/* Main Content Pane */}
            <motion.main
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* === TAB: MY BOOKINGS === */}
              {activeTab === "My Bookings" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-xl p-8 shadow-luxury border border-outline-variant/10">
                    <div className={cn("flex items-center justify-between mb-6", isRtl && "flex-row-reverse")}>
                      <h2 className="font-caslon text-headline-lg text-deep-navy">
                        {locale === "en" ? "My Bookings" : "حجوزاتي المسجلة"}
                      </h2>
                      <span className="bg-sand-beige text-deep-navy px-3 py-1 rounded-full text-xs font-bold font-jakarta">
                        {requests.length} {locale === "en" ? "Requests" : "طلبات معاملات"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {requests.length > 0 ? (
                        requests.map((booking, i) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors duration-300 group border border-outline-variant/5", isRtl && "sm:flex-row-reverse")}
                          >
                            <div className={cn("flex items-center gap-4 min-w-0", isRtl && "flex-row-reverse text-right")}>
                              <div className="w-12 h-12 rounded-xl bg-sand-beige flex items-center justify-center shrink-0 group-hover:bg-deep-navy transition-colors duration-300">
                                <span className="material-symbols-outlined text-champagne-gold group-hover:text-white">
                                  {bookingTypeIcon[booking.type] || "explore"}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-jakarta font-bold text-deep-navy text-sm truncate">{booking.title}</p>
                                <p className="font-jakarta text-[11px] text-outline">
                                  ID: {booking.id} · {new Date(booking.createdTime).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className={cn("flex sm:flex-col items-center justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-none border-outline-variant/10 shrink-0", isRtl ? "sm:items-start" : "sm:items-end")}>
                              <StatusBadge status={booking.status} />
                              <p className="font-caslon text-sm font-bold text-champagne-gold">${booking.amount.toLocaleString()}</p>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <EmptyState
                          title={locale === "en" ? "No Bookings Recorded" : "لا توجد حجوزات مسجلة"}
                          description={locale === "en" 
                            ? "You haven't submitted any travel bookings yet. Explore flights, hotels, or packages to make your first request."
                            : "لم تقم بتقديم أي طلبات حجز بعد. استكشف الطيران، الفنادق، أو البرامج السياحية لتسجيل أول حجز."}
                        />
                      )}
                    </div>
                  </div>

                  {/* Upcoming Trip Card */}
                  <div className="bg-deep-navy rounded-xl p-8 shadow-luxury relative overflow-hidden">
                    <div className={cn("relative z-10 animate-fadeIn", isRtl ? "text-right" : "text-left")}>
                      <p className="font-jakarta text-label-lg text-champagne-gold tracking-widest uppercase mb-3">
                        {locale === "en" ? "Next Adventure" : "مغامرتك القادمة"}
                      </p>
                      <h3 className="font-caslon text-headline-lg text-white mb-2">Cairo → Dubai</h3>
                      <p className="font-jakarta text-white/70 mb-6">
                        {locale === "en" ? "August 15, 2026 · Business Class · Emirates EK 924" : "١٥ أغسطس ٢٠٢٦ · درجة رجال الأعمال · طيران الإمارات EK 924"}
                      </p>
                      <div className={cn("flex gap-4", isRtl && "justify-start flex-row-reverse")}>
                        <button className="bg-champagne-gold text-deep-navy font-jakarta font-bold px-6 py-3 rounded-full text-sm hover:bg-white transition-all duration-300 active:scale-95">
                          {locale === "en" ? "View Itinerary" : "عرض خطة الرحلة"}
                        </button>
                        <button className="border border-white/30 text-white font-jakarta font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-all duration-300">
                          {locale === "en" ? "Check In Online" : "تسجيل وصول إلكتروني"}
                        </button>
                      </div>
                    </div>
                    <div className={cn("absolute opacity-10 text-white z-0 pointer-events-none", isRtl ? "-left-8 -bottom-8" : "-right-8 -bottom-8")} aria-hidden="true">
                      <span className="material-symbols-outlined text-[120px]">flight</span>
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB: SAVED TRIPS === */}
              {activeTab === "Saved Trips" && (
                <div className="bg-white rounded-xl p-8 shadow-luxury border border-outline-variant/10 animate-fadeIn">
                  <h2 className={cn("font-caslon text-headline-lg text-deep-navy mb-6", isRtl && "text-right")}>
                    {locale === "en" ? "Saved Trips & Packages" : "الرحلات والبرامج السياحية المحفوظة"}
                  </h2>
                  {savedTrips.length > 0 ? (
                    <div className="space-y-6">
                      {savedTrips.map((trip) => {
                        let displayType = trip.type;
                        if (locale === "ar") {
                          displayType = trip.type === "Package" ? "برنامج سياحي" : "فندق";
                        }
                        return (
                          <div key={trip.id} className={cn("flex flex-col sm:flex-row gap-4 p-4 border border-outline-variant/10 rounded-xl hover:shadow-luxury transition-all duration-300 bg-white", isRtl && "sm:flex-row-reverse")}>
                            <div className="relative w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                              <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div className={isRtl ? "text-right" : "text-left"}>
                                <span className="bg-sand-beige text-deep-navy text-[10px] font-bold px-2 py-0.5 rounded uppercase font-jakarta">
                                  {displayType}
                                </span>
                                <h3 className="font-caslon text-base text-deep-navy font-bold mt-1.5">{trip.title}</h3>
                                <p className={cn("font-jakarta text-xs text-outline flex items-center gap-1 mt-1", isRtl && "flex-row-reverse justify-end")}>
                                  <span className="material-symbols-outlined text-xs">location_on</span> <span>{trip.location}</span>
                                </p>
                              </div>
                              <div className={cn("flex items-center justify-between border-t border-outline-variant/5 pt-3 mt-3", isRtl && "flex-row-reverse")}>
                                <span className="font-caslon text-sm font-bold text-champagne-gold">${trip.price.toLocaleString()}</span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleRemoveSaved(trip.id, trip.title)}
                                    className="w-8 h-8 rounded-full border border-outline-variant text-outline hover:text-error hover:bg-red-50 flex items-center justify-center transition-colors"
                                    title={locale === "en" ? "Remove from saved" : "إزالة من المحفوظات"}
                                    aria-label={`Remove ${trip.title}`}
                                  >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                  </button>
                                  <Link
                                    href={trip.type === "Package" ? "/packages" : "/hotels"}
                                    className="bg-deep-navy text-white text-xs font-jakarta font-bold px-4 py-2 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all"
                                  >
                                    {locale === "en" ? "Book Now" : "احجز الآن"}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      title={locale === "en" ? "No Saved Trips" : "لا توجد رحلات محفوظة"}
                      description={locale === "en"
                        ? "Click the favorite heart icon across search results to compile custom packages and hotels here."
                        : "اضغط على رمز القلب المفضل عبر نتائج البحث لتجميع الفنادق والبرامج السياحية هنا."}
                    />
                  )}
                </div>
              )}

              {/* === TAB: VISA APPLICATIONS === */}
              {activeTab === "Visa Applications" && (
                <div className="bg-white rounded-xl p-8 shadow-luxury border border-outline-variant/10 animate-fadeIn">
                  <h2 className={cn("font-caslon text-headline-lg text-deep-navy mb-6", isRtl && "text-right")}>
                    {locale === "en" ? "Visa Applications Log" : "سجل طلبات التأشيرات والمستندات"}
                  </h2>
                  <div className="space-y-4">
                    {requests.filter(r => r.type.toLowerCase().includes("visa")).length > 0 ? (
                      requests.filter(r => r.type.toLowerCase().includes("visa")).map((r) => (
                        <div key={r.id} className={cn("p-5 border border-outline-variant/10 rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-between gap-4", isRtl && "flex-row-reverse")}>
                          <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
                            <div className="w-10 h-10 rounded-xl bg-sand-beige text-champagne-gold flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-xl">description</span>
                            </div>
                            <div>
                              <h3 className="font-caslon text-base text-deep-navy font-bold">{r.title}</h3>
                              <p className="font-jakarta text-[11px] text-outline mt-0.5">
                                {locale === "en" ? "Application ID: " : "مرجع الطلب: "}{r.id} · {locale === "en" ? "Submitted: " : "تم التقديم: "}{new Date(r.createdTime).toLocaleDateString()}
                              </p>
                              {r.documents && r.documents.length > 0 && (
                                <p className={cn("font-jakarta text-[10px] text-green-700 font-bold mt-1.5 flex items-center gap-1", isRtl && "flex-row-reverse")}>
                                  <span className="material-symbols-outlined text-[10px]">check_circle</span>
                                  <span>
                                    {locale === "en" ? `${r.documents.length} Required documents uploaded` : `تم رفع ${r.documents.length} مستندات رسمية مطلوبة`}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <StatusBadge status={r.status} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        title={locale === "en" ? "No Visa Consultations Found" : "لم يتم العثور على طلبات تأشيرة"}
                        description={locale === "en"
                          ? "You haven't submitted any visa requests. Open the Visa center portal to apply for worldwide visas."
                          : "لم تقم بتقديم أي طلب تأشيرة بعد. افتح مركز خدمات التأشيرات للتقديم على أي دولة حول العالم."}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* === TAB: PAYMENT METHODS === */}
              {activeTab === "Payment Methods" && (
                <div className="bg-white rounded-xl p-8 shadow-luxury border border-outline-variant/10 animate-fadeIn">
                  <div className={cn("flex items-center justify-between mb-6", isRtl && "flex-row-reverse")}>
                    <h2 className="font-caslon text-headline-lg text-deep-navy">
                      {locale === "en" ? "Saved Cards" : "بطاقات الدفع المحفوظة"}
                    </h2>
                    <button
                      onClick={() => triggerToast(locale === "en" ? "Add New Card configuration coming soon." : "إضافة بطاقة دفع جديدة قريباً.")}
                      className={cn("bg-deep-navy text-white text-xs font-jakarta font-bold px-4 py-2 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all flex items-center gap-1.5", isRtl && "flex-row-reverse")}
                    >
                      <span className="material-symbols-outlined text-xs">add</span> 
                      <span>{locale === "en" ? "Add Card" : "إضافة بطاقة"}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((c) => (
                      <div key={c.id} className="relative rounded-xl bg-gradient-to-tr from-deep-navy to-blue-900 p-6 text-white shadow-luxury overflow-hidden border border-white/5">
                        <div className={cn("flex justify-between items-start mb-6", isRtl && "flex-row-reverse")}>
                          <div className={isRtl ? "text-right" : "text-left"}>
                            <p className="text-white/50 text-[10px] uppercase tracking-widest">{locale === "en" ? "Card Provider" : "مزود البطاقة"}</p>
                            <p className="font-jakarta font-bold text-sm">{c.brand}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteCard(c.id, c.last4)}
                            className="w-7 h-7 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 rounded-full flex items-center justify-center transition-colors"
                            aria-label={`Delete card ending in ${c.last4}`}
                          >
                            <span className="material-symbols-outlined text-xs">delete</span>
                          </button>
                        </div>
                        <p className="font-mono text-lg tracking-widest mb-4">•••• •••• •••• {c.last4}</p>
                        <div className={cn("flex justify-between items-end text-xs font-jakarta", isRtl && "flex-row-reverse")}>
                          <div className={isRtl ? "text-right" : "text-left"}>
                            <p className="text-white/40 text-[9px] uppercase tracking-wider">{locale === "en" ? "Card Holder" : "حامل البطاقة"}</p>
                            <p className="font-semibold">{c.holder}</p>
                          </div>
                          <div className={isRtl ? "text-right" : "text-left"}>
                            <p className="text-white/40 text-[9px] uppercase tracking-wider">{locale === "en" ? "Expires" : "تاريخ الانتهاء"}</p>
                            <p className="font-semibold">{c.expiry}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === TAB: SETTINGS === */}
              {activeTab === "Settings" && (
                <div className="bg-white rounded-xl p-8 shadow-luxury border border-outline-variant/10 animate-fadeIn">
                  <h2 className={cn("font-caslon text-headline-lg text-deep-navy mb-6", isRtl && "text-right")}>
                    {locale === "en" ? "Personal Profile Information" : "المعلومات الشخصية للملف الشخصي"}
                  </h2>
                  <form onSubmit={handleSaveSettings} className="space-y-4" aria-label="Personal information settings form">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: "first-name", label: locale === "en" ? "First Name" : "الاسم الأول", value: "Ahmed" },
                        { id: "last-name", label: locale === "en" ? "Last Name" : "الاسم الأخير", value: "Al-Hassan" },
                        { id: "email-address", label: locale === "en" ? "Email" : "البريد الإلكتروني", value: "ahmed.hassan@email.com", type: "email" },
                        { id: "phone-number", label: locale === "en" ? "Phone" : "رقم الهاتف", value: "+20 100 123 4567", type: "tel" },
                        { id: "passport-no", label: locale === "en" ? "Passport Number" : "رقم جواز السفر", value: "A12345678" },
                        { id: "nationality-val", label: locale === "en" ? "Nationality" : "الجنسية", value: "Egyptian" },
                      ].map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label htmlFor={field.id} className={cn("font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block", isRtl && "text-right")}>
                            {field.label}
                          </label>
                          <input
                            id={field.id}
                            type={field.type || "text"}
                            defaultValue={field.value}
                            className={cn(
                              "w-full px-4 py-3 border border-outline-variant rounded-xl font-jakarta text-body-md text-deep-navy focus:outline-none focus:border-champagne-gold transition-colors bg-white",
                              isRtl && "text-right"
                            )}
                          />
                        </div>
                      ))}
                    </div>
                    <div className={cn("flex gap-4 pt-4", isRtl && "flex-row-reverse")}>
                      <button type="submit" className="bg-deep-navy text-white font-jakarta font-bold px-8 py-3 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95 text-sm">
                        {locale === "en" ? "Save Changes" : "حفظ التغييرات"}
                      </button>
                      <button type="button" onClick={() => triggerToast(locale === "en" ? "Edit reset to defaults." : "تم إلغاء التغييرات أصولاً.")} className="border border-outline-variant text-on-surface-variant font-jakarta font-semibold px-8 py-3 rounded-full hover:bg-sand-beige transition-all duration-300 text-sm">
                        {locale === "en" ? "Cancel" : "إلغاء"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.main>
          </div>
        </div>
      </PublicLayout>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-deep-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-luxury-lg border border-outline-variant/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 mx-auto mb-5">
                <span className="material-symbols-outlined text-2xl">logout</span>
              </div>
              <h2 className="font-caslon text-headline-md text-deep-navy mb-2">
                {locale === "en" ? "Confirm Log Out" : "تأكيد تسجيل الخروج"}
              </h2>
              <p className="font-jakarta text-xs text-on-surface-variant mb-6 leading-relaxed">
                {locale === "en" 
                  ? "Are you sure you want to log out of your premium member account? You will need to sign in again to access bookings."
                  : "هل أنت متأكد من رغبتك في تسجيل الخروج من حساب العضوية المميزة؟ ستحتاج إلى تسجيل الدخول مجدداً للوصول لحجوزاتك."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 text-white font-jakarta font-bold py-2.5 rounded-full hover:bg-red-700 transition-colors text-sm"
                >
                  {locale === "en" ? "Log Out" : "تسجيل الخروج"}
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 border border-outline-variant text-deep-navy font-jakarta font-semibold py-2.5 rounded-full hover:bg-sand-beige transition-all text-sm"
                >
                  {locale === "en" ? "Cancel" : "إلغاء"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
