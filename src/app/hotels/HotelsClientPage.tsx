"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PublicLayout from "@/components/layout/PublicLayout";
import { cn } from "@/lib/utils";
import HotelCard from "@/components/cards/HotelCard";
import EmptyState from "@/components/ui/EmptyState";
import { submitTravelRequest } from "@/lib/api-client";
import { useTranslation } from "@/components/layout/I18nProvider";
import { getHotels } from "@/services/hotels";

const searchSchema = z.object({
  location: z.string().min(2, "Destination is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
}).refine(
  (data) => {
    if (data.checkIn && data.checkOut) {
      return new Date(data.checkOut) > new Date(data.checkIn);
    }
    return true;
  },
  {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  }
);

type SearchFormValues = z.infer<typeof searchSchema>;

export default function HotelsClientPage() {
  const { locale, dir, t } = useTranslation();
  const isRtl = dir === "rtl";

  const [view, setView] = useState<"list" | "map">("list");
  
  // Filters
  const [starFilter, setStarFilter] = useState<number[]>([]);
  const [amenityFilter, setAmenityFilter] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [bookedRequest, setBookedRequest] = useState<{ id: string; title: string } | null>(null);

  // Dynamic hotels data
  const [hotelsData, setHotelsData] = useState<any[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);

  useEffect(() => {
    async function loadHotels() {
      setLoadingHotels(true);
      try {
        const data = await getHotels(locale);
        setHotelsData(data ?? []);
      } catch (err) {
        console.error("Failed to load hotels:", err);
      } finally {
        setLoadingHotels(false);
      }
    }
    loadHotels();
  }, [locale]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: locale === "en" ? "Cairo Luxury Collection" : "مجموعة فنادق القاهرة الفاخرة",
      checkIn: "",
      checkOut: "",
    },
  });

  const locationValue = watch("location");
  const checkInValue = watch("checkIn");
  const checkOutValue = watch("checkOut");

  const handleBookHotel = async (hotel: any) => {
    const nights = (checkInValue && checkOutValue) 
      ? Math.max(1, Math.round((new Date(checkOutValue).getTime() - new Date(checkInValue).getTime()) / (1000 * 60 * 60 * 24)))
      : 3; // Default to 3 nights if dates empty

    const detailsStr = `Hotel: ${hotel.name}. Location: ${hotel.location}. Stars: ${hotel.stars}. Category: ${hotel.category}. Check-in: ${checkInValue || "Not specified"}. Check-out: ${checkOutValue || "Not specified"}. Nights: ${nights}. Amenities: ${hotel.amenities.join(", ")}.`;
    const price = hotel.price * nights;

    try {
      const result = await submitTravelRequest({
      customerName: "Ahmed Al-Hassan",
      email: "customer@cairohangzhou.com",
      phone: "+20 100 123 4567",
      type: "hotel",
      title: hotel.name,
      details: detailsStr,
      amount: price,
      });

      setBookedRequest({
        id: result.id,
        title: hotel.name,
      });
    } catch {
      alert("Failed to submit hotel request.");
    }
  };

  const onSearchSubmit = (data: SearchFormValues) => {
    // Search handler
  };

  // Filtered hotels computed data
  const filteredHotels = useMemo(() => {
    let result = hotelsData;

    // Filter by location search (city or country)
    if (locationValue) {
      result = result.filter(
        (h) =>
          h.location.toLowerCase().includes(locationValue.toLowerCase()) ||
          h.city.toLowerCase().includes(locationValue.toLowerCase())
      );
    }

    // Filter by stars
    if (starFilter.length > 0) {
      result = result.filter((h) => starFilter.includes(h.stars));
    }

    // Filter by amenities
    if (amenityFilter.length > 0) {
      result = result.filter((h) =>
        amenityFilter.every((amenity) => {
          // Check English and Arabic amenity names
          const defaultAmenitiesMap: Record<string, string> = {
            "Pool": "مسبح",
            "Spa": "سبا / منتجع صحي",
            "Fine Dining": "مطعم فاخر",
            "Fitness Center": "مركز لياقة بدنية",
            "Concierge": "كونسيرج",
            "Free WiFi": "واي فاي مجاني",
            "Airport Shuttle": "نقل مطار",
            "Bar / Lounge": "صالة لاونج"
          };
          const arName = defaultAmenitiesMap[amenity] || "";
          return h.amenities.includes(amenity) || (arName && h.amenities.includes(arName));
        })
      );
    }

    // Filter by min/max price
    const minVal = parseFloat(priceMin);
    const maxVal = parseFloat(priceMax);
    if (!isNaN(minVal)) {
      result = result.filter((h) => h.price >= minVal);
    }
    if (!isNaN(maxVal)) {
      result = result.filter((h) => h.price <= maxVal);
    }

    return result;
  }, [hotelsData, locationValue, starFilter, amenityFilter, priceMin, priceMax]);

  return (
    <>
      <PublicLayout>
        {/* Search Hero */}
        <section className="bg-deep-navy pt-24 pb-12 lg:pt-32 lg:pb-16" aria-label="Hotel search">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-16">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={fadeUp} custom={0} className={cn("font-jakarta text-label-lg text-champagne-gold tracking-widest uppercase mb-3", isRtl && "tracking-normal")}>
                {locale === "en" ? "Ultra-Luxe Stays" : "ملاذات إقامة استثنائية"}
              </motion.p>
              <h1 className={cn("font-caslon text-display-lg-mobile md:text-headline-lg text-white mb-8", isRtl && "text-right")}>
                {locale === "en" ? "Find Your Sanctuary Worldwide" : "اعثر على ملاذك الفاخر حول العالم"}
              </h1>

              <motion.div variants={fadeUp} custom={2} className="bg-white rounded-xl p-4 lg:p-6 shadow-luxury-lg">
                <form onSubmit={handleSubmit(onSearchSubmit)}>
                  <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-3 items-start", isRtl && "text-right")}>
                    
                    <div className="space-y-1">
                      <label htmlFor="hotel-location" className="font-jakarta text-label-sm text-outline font-semibold uppercase tracking-wider block">
                        {locale === "en" ? "Destination" : "الوجهة"}
                      </label>
                      <div className="relative">
                        <span className={cn("material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-champagne-gold text-lg", isRtl ? "right-3" : "left-3")}>location_on</span>
                        <input
                          id="hotel-location"
                          type="text"
                          {...register("location")}
                          className={cn(
                            "w-full py-3 border border-outline-variant rounded-xl font-jakarta text-body-md text-deep-navy focus:outline-none focus:border-champagne-gold transition-colors",
                            isRtl ? "pr-10 pl-3 text-right" : "pl-10 pr-3 text-left"
                          )}
                          aria-invalid={!!errors.location}
                        />
                      </div>
                      {errors.location && (
                        <p className="text-error text-xs font-jakarta" role="alert">
                          {locale === "en" ? errors.location.message : "الوجهة مطلوبة"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="check-in-date" className="font-jakarta text-label-sm text-outline font-semibold uppercase tracking-wider block">
                        {locale === "en" ? "Check-in" : "تاريخ الوصول"}
                      </label>
                      <div className="relative">
                        <span className={cn("material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-champagne-gold text-lg", isRtl ? "right-3" : "left-3")}>login</span>
                        <input
                          id="check-in-date"
                          type="date"
                          {...register("checkIn")}
                          className={cn(
                            "w-full py-3 border border-outline-variant rounded-xl font-jakarta text-body-md text-deep-navy focus:outline-none focus:border-champagne-gold transition-colors",
                            isRtl ? "pr-10 pl-3 text-right" : "pl-10 pr-3 text-left"
                          )}
                          aria-invalid={!!errors.checkIn}
                        />
                      </div>
                      {errors.checkIn && (
                        <p className="text-error text-xs font-jakarta" role="alert">
                          {locale === "en" ? errors.checkIn.message : "تاريخ الدخول مطلوب"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="check-out-date" className="font-jakarta text-label-sm text-outline font-semibold uppercase tracking-wider block">
                        {locale === "en" ? "Check-out" : "تاريخ المغادرة"}
                      </label>
                      <div className="relative">
                        <span className={cn("material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-champagne-gold text-lg", isRtl ? "right-3" : "left-3")}>logout</span>
                        <input
                          id="check-out-date"
                          type="date"
                          {...register("checkOut")}
                          className={cn(
                            "w-full py-3 border border-outline-variant rounded-xl font-jakarta text-body-md text-deep-navy focus:outline-none focus:border-champagne-gold transition-colors",
                            isRtl ? "pr-10 pl-3 text-right" : "pl-10 pr-3 text-left"
                          )}
                          aria-invalid={!!errors.checkOut}
                        />
                      </div>
                      {errors.checkOut && (
                        <p className="text-error text-xs font-jakarta" role="alert">
                          {locale === "en" ? errors.checkOut.message : "تاريخ المغادرة يجب أن يكون بعد الوصول"}
                        </p>
                      )}
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        className="w-full bg-deep-navy text-white font-jakarta font-bold py-3.5 px-6 rounded-xl hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">search</span>
                        {locale === "en" ? "Search Hotels" : "البحث عن فنادق"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16 py-10">
          {/* Header with view toggle */}
          <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8", isRtl && "md:flex-row-reverse text-right")}>
            <div className={isRtl ? "text-right" : "text-left"}>
              <nav className={cn("flex items-center gap-2 mb-2", isRtl && "flex-row-reverse justify-end")} aria-label="Breadcrumb">
                <span className="text-label-sm font-jakarta text-outline">
                  {locale === "en" ? "Destinations" : "الوجهات"}
                </span>
                <span className={cn("material-symbols-outlined text-outline text-sm", isRtl && "rotate-180")}>chevron_right</span>
                <span className="font-jakarta text-label-sm font-semibold text-deep-navy">{locationValue || (locale === "en" ? "Global" : "عالمي")}</span>
              </nav>
              <h2 className="font-caslon text-headline-lg text-deep-navy">
                {locale === "en" ? "Global Luxury Collection" : "مجموعة الفنادق الفاخرة العالمية"}
              </h2>
              <p className="font-jakarta text-on-surface-variant text-body-md mt-1" aria-live="polite">
                {locale === "en"
                  ? `Discover ${filteredHotels.length} exceptional properties across every continent — from iconic cityscapes to pristine island retreats.`
                  : `اكتشف ${filteredHotels.length} من العقارات والفنادق الاستثنائية عبر القارات — من المدن الأيقونية حتى الجزر الساحرة.`}
              </p>
            </div>
            <div className="flex items-center bg-sand-beige p-1 rounded border border-outline-variant/30">
              {[["list", "format_list_bulleted", locale === "en" ? "List" : "قائمة"], ["map", "map", locale === "en" ? "Map View" : "عرض الخريطة"]].map(([v, icon, label]) => (
                <button
                  key={v}
                  onClick={() => setView(v as "list" | "map")}
                  className={cn(
                    "px-5 py-2 rounded font-jakarta font-semibold text-sm transition-all duration-300 flex items-center gap-2",
                    view === v ? "bg-white text-deep-navy shadow-luxury" : "text-on-surface-variant hover:text-deep-navy"
                  )}
                  aria-pressed={view === v}
                >
                  <span className="material-symbols-outlined text-base">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={cn("flex flex-col gap-8", isRtl ? "lg:flex-row-reverse" : "lg:flex-row")}>
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-luxury sticky top-28 border border-outline-variant/10">
                <div className={cn("flex items-center justify-between mb-6", isRtl && "flex-row-reverse")}>
                  <h3 className="font-caslon text-headline-md text-deep-navy">
                    {locale === "en" ? "Refine" : "تصفية الفنادق"}
                  </h3>
                  <button
                    onClick={() => { setStarFilter([]); setAmenityFilter([]); setPriceMin(""); setPriceMax(""); }}
                    className="font-jakarta text-label-sm text-champagne-gold font-semibold uppercase tracking-wider"
                  >
                    {locale === "en" ? "Reset" : "إعادة ضبط"}
                  </button>
                </div>

                {/* Stars */}
                <div className={cn("mb-8", isRtl && "text-right")}>
                  <h4 className="font-jakarta font-semibold text-label-lg text-deep-navy mb-4">
                    {locale === "en" ? "Star Rating" : "تصنيف النجوم"}
                  </h4>
                  <div className="space-y-3">
                    {[5, 4, 3].map((s) => (
                      <label key={s} className={cn("flex items-center gap-3 cursor-pointer group", isRtl && "flex-row-reverse")}>
                        <input
                          type="checkbox"
                          checked={starFilter.includes(s)}
                          onChange={(e) => setStarFilter((prev) => e.target.checked ? [...prev, s] : prev.filter((x) => x !== s))}
                          className="w-4 h-4 rounded border-outline-variant accent-champagne-gold"
                        />
                        <span className="font-jakarta text-sm text-on-surface-variant group-hover:text-deep-navy">
                          {s} {locale === "en" ? "Star Luxury" : "نجوم فاخر"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className={cn("mb-8", isRtl && "text-right")}>
                  <h4 className="font-jakarta font-semibold text-label-lg text-deep-navy mb-4">
                    {locale === "en" ? "Amenities" : "المرافق والخدمات"}
                  </h4>
                  <div className="space-y-3">
                    {["Pool", "Spa", "Fine Dining", "Fitness Center", "Concierge", "Free WiFi", "Airport Shuttle", "Bar / Lounge"].map((a) => {
                      const amenitiesTranslations: Record<string, string> = {
                        "Pool": "مسبح",
                        "Spa": "سبا / منتجع صحي",
                        "Fine Dining": "مطعم فاخر",
                        "Fitness Center": "مركز لياقة بدنية",
                        "Concierge": "كونسيرج",
                        "Free WiFi": "واي فاي مجاني",
                        "Airport Shuttle": "نقل مطار",
                        "Bar / Lounge": "صالة لاونج"
                      };
                      return (
                        <label key={a} className={cn("flex items-center gap-3 cursor-pointer group", isRtl && "flex-row-reverse")}>
                          <input
                            type="checkbox"
                            checked={amenityFilter.includes(a)}
                            onChange={(e) => setAmenityFilter((prev) => e.target.checked ? [...prev, a] : prev.filter((x) => x !== a))}
                            className="w-4 h-4 rounded border-outline-variant accent-champagne-gold"
                          />
                          <span className="font-jakarta text-sm text-on-surface-variant group-hover:text-deep-navy">
                            {locale === "en" ? a : amenitiesTranslations[a] || a}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Price range input fields */}
                <div className={isRtl ? "text-right" : "text-left"}>
                  <h4 className="font-jakarta font-semibold text-label-lg text-deep-navy mb-4">
                    {locale === "en" ? "Price per Night" : "السعر لليلة الواحدة"}
                  </h4>
                  <div className="flex gap-4">
                    <input
                      placeholder={locale === "en" ? "Min" : "الأقل"}
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className={cn("w-full border border-outline-variant rounded-xl py-2 px-3 font-jakarta text-sm focus:outline-none focus:border-champagne-gold transition-colors bg-white", isRtl && "text-right")}
                    />
                    <input
                      placeholder={locale === "en" ? "Max" : "الأعلى"}
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className={cn("w-full border border-outline-variant rounded-xl py-2 px-3 font-jakarta text-sm focus:outline-none focus:border-champagne-gold transition-colors bg-white", isRtl && "text-right")}
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Hotel Cards List */}
            <div className="flex-1 space-y-6">
              <AnimatePresence mode="wait">
                {loadingHotels ? (
                  <div className="py-20 flex justify-center items-center">
                    <div className="w-8 h-8 border-2 border-champagne-gold border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : filteredHotels.length > 0 ? (
                  <motion.div key="hotels-list" className="space-y-6">
                    {filteredHotels.map((hotel, i) => (
                      <HotelCard key={hotel.id} hotel={hotel} index={i} onBook={handleBookHotel} />
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    key="empty-state"
                    title={locale === "en" ? "No Hotels Found" : "لم يتم العثور على فنادق"}
                    description={locale === "en" 
                      ? "We couldn't find any premium hotels matching your active filters. Try refining your parameters."
                      : "لم نتمكن من العثور على فنادق فاخرة مطابقة لخيارات التصفية النشطة الحالية."}
                    actionLabel={locale === "en" ? "Clear Price Constraints" : "إعادة تعيين الأسعار"}
                    onAction={() => {
                      setPriceMin("");
                      setPriceMax("");
                    }}
                  />
                )}
              </AnimatePresence>
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
                {locale === "en" ? "Booking Request Received" : "تم استلام طلب الحجز بنجاح"}
              </h2>
              <p className="font-jakarta text-label-sm text-champagne-gold font-bold uppercase tracking-wider mb-4">
                {locale === "en" ? "ID: " : "مرجع الطلب: "}{bookedRequest.id}
              </p>
              <p className="font-jakarta text-body-md text-on-surface-variant mb-6 leading-relaxed">
                {locale === "en" 
                  ? `Your reservation request for ${bookedRequest.title} has been logged. An email confirmation has been generated, and an advisor is reviewing your request.`
                  : `تم تسجيل طلب الحجز الخاص بك لفندق ${bookedRequest.title}. تم إرسال إشعار بريد إلكتروني، ويقوم مستشار السفر لدينا بمراجعة طلبك وتأكيده.`}
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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};
