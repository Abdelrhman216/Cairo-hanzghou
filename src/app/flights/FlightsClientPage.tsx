"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PublicLayout from "@/components/layout/PublicLayout";
import { CABIN_CLASSES, TRIP_TYPES, PRICE_RANGES } from "@/lib/config/services";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { submitTravelRequest } from "@/lib/api-client";
import { useTranslation } from "@/components/layout/I18nProvider";
import { getFlights } from "@/services/flights";

const POPULAR_AIRPORTS = [
  "Cairo (CAI)", "Dubai (DXB)", "London (LHR)", "New York (JFK)", "Paris (CDG)",
  "Tokyo (NRT)", "Singapore (SIN)", "Sydney (SYD)", "Hangzhou (HGH)", "Istanbul (IST)",
  "Bangkok (BKK)", "Kuala Lumpur (KUL)", "Frankfurt (FRA)", "Amsterdam (AMS)", "Toronto (YYZ)",
  "Los Angeles (LAX)", "Chicago (ORD)", "Mumbai (BOM)", "Seoul (ICN)", "Hong Kong (HKG)",
  "Doha (DOH)", "Riyadh (RUH)", "Casablanca (CMN)", "Nairobi (NBO)", "São Paulo (GRU)",
];

const MAJOR_AIRLINES = [
  "Emirates", "Qatar Airways", "Etihad Airways", "Singapore Airlines", "Lufthansa",
  "British Airways", "Air France", "Turkish Airlines", "EgyptAir", "Air China",
  "Japan Airlines", "Korean Air", "Cathay Pacific", "Delta Air Lines", "United Airlines",
];

// We can build the Zod schema inside the component or keep it here.
const searchSchema = z.object({
  tripType: z.string(),
  cabinClass: z.string(),
  from: z.string().min(3, "Select a valid departure airport"),
  to: z.string().min(3, "Select a valid destination airport"),
  departDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().optional(),
  passengers: z.number().min(1).max(8),
}).refine(
  (data) => {
    if (data.from.toLowerCase() === data.to.toLowerCase() && data.from !== "") {
      return false;
    }
    return true;
  },
  {
    message: "Departure and destination must be different",
    path: ["to"],
  }
).refine(
  (data) => {
    if (data.tripType === "Round Trip" && !data.returnDate) {
      return false;
    }
    return true;
  },
  {
    message: "Return date is required for round trips",
    path: ["returnDate"],
  }
);

type SearchFormValues = z.infer<typeof searchSchema>;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function FlightsClientPage() {
  const { locale, dir, t } = useTranslation();
  const isRtl = dir === "rtl";

  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const [bookedRequest, setBookedRequest] = useState<{ id: string; title: string } | null>(null);
  
  // Dynamic flight routes from localized database
  const [flightsData, setFlightsData] = useState<any[]>([]);
  const [loadingFlights, setLoadingFlights] = useState(true);

  // Filters
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [airlineFilter, setAirlineFilter] = useState<string[]>([]);
  const [stopsFilter, setStopsFilter] = useState<string[]>([]);

  useEffect(() => {
    async function loadFlights() {
      setLoadingFlights(true);
      try {
        const data = await getFlights(locale);
        setFlightsData(data ?? []);
      } catch (err) {
        console.error("Failed to load flights:", err);
      } finally {
        setLoadingFlights(false);
      }
    }
    loadFlights();
  }, [locale]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      tripType: "Round Trip",
      cabinClass: "Business",
      from: "",
      to: "",
      departDate: "",
      returnDate: "",
      passengers: 1,
    },
  });

  const tripType = watch("tripType");
  const cabinClass = watch("cabinClass");
  const fromValue = watch("from");
  const toValue = watch("to");
  const passengers = watch("passengers");

  const swapRoutes = (e: React.MouseEvent) => {
    e.preventDefault();
    const temp = fromValue;
    setValue("from", toValue);
    setValue("to", temp);
  };

  const handleFromChange = (val: string) => {
    setValue("from", val);
    if (val.length >= 2) {
      const filtered = POPULAR_AIRPORTS.filter((a) =>
        a.toLowerCase().includes(val.toLowerCase())
      );
      setFromSuggestions(filtered);
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToChange = (val: string) => {
    setValue("to", val);
    if (val.length >= 2) {
      const filtered = POPULAR_AIRPORTS.filter((a) =>
        a.toLowerCase().includes(val.toLowerCase())
      );
      setToSuggestions(filtered);
    } else {
      setToSuggestions([]);
    }
  };

  const onSearchSubmit = () => {
    setSearched(true);
  };

  const handleBookFlight = async (flight: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const requestTitle = `${flight.fromCity} (${flight.fromCode}) → ${flight.toCity} (${flight.toCode}) via ${flight.airline}`;
    const detailsStr = `Airline: ${flight.airline}. Flight: ${flight.flightNumber}. Duration: ${flight.duration}. Stops: ${flight.stops}. Class: ${cabinClass}. Passengers: ${passengers}. Depart Date: ${watch("departDate")}. Return Date: ${watch("returnDate") || "N/A"}.`;
    const price = flight.price * passengers;

    try {
      const result = await submitTravelRequest({
      customerName: "Ahmed Al-Hassan",
      email: "customer@cairohangzhou.com",
      phone: "+20 100 123 4567",
      type: "flight",
      title: requestTitle,
      details: detailsStr,
      amount: price,
      });

      setBookedRequest({
        id: result.id,
        title: requestTitle,
      });
    } catch {
      alert("Failed to submit booking request.");
    }
  };

  // Filter flights data
  const displayedFlights = useMemo(() => {
    let result = flightsData;

    if (searched) {
      result = flightsData.filter((f) => {
        const matchFrom = !fromValue || f.fromCity.toLowerCase().includes(fromValue.toLowerCase()) || f.fromCode.toLowerCase().includes(fromValue.toLowerCase().slice(0, 3));
        const matchTo = !toValue || f.toCity.toLowerCase().includes(toValue.toLowerCase()) || f.toCode.toLowerCase().includes(toValue.toLowerCase().slice(0, 3));
        return matchFrom || matchTo;
      });
    }

    // Filter by stops
    if (stopsFilter.length > 0) {
      result = result.filter((f) => {
        if (stopsFilter.includes("Non-stop") && f.stops === 0) return true;
        if (stopsFilter.includes("1 Stop") && f.stops === 1) return true;
        if (stopsFilter.includes("2+ Stops") && f.stops >= 2) return true;
        // Arabic equivalents
        if (stopsFilter.includes("بدون توقف") && f.stops === 0) return true;
        if (stopsFilter.includes("توقف واحد") && f.stops === 1) return true;
        if (stopsFilter.includes("توقفين أو أكثر") && f.stops >= 2) return true;
        return false;
      });
    }

    // Filter by price
    if (priceFilter.length > 0) {
      result = result.filter((f) => {
        return priceFilter.some((range) => {
          if (range.includes("Under $500") || range.includes("أقل من 500$")) return f.price < 500;
          if (range.includes("$500 - $1,500") || range.includes("500$ - 1500$")) return f.price >= 500 && f.price <= 1500;
          if (range.includes("Over $1,500") || range.includes("أكثر من 1500$")) return f.price > 1500;
          return false;
        });
      });
    }

    // Filter by airline
    if (airlineFilter.length > 0) {
      result = result.filter((f) => {
        // Match English name or localized Arabic airline name
        return airlineFilter.includes(f.airline) || airlineFilter.some(filterAirline => f.airline.includes(filterAirline));
      });
    }

    return result;
  }, [flightsData, searched, fromValue, toValue, priceFilter, airlineFilter, stopsFilter]);

  return (
    <>
      <PublicLayout>
        {/* Hero Search Section */}
        <section className="bg-deep-navy pt-24 pb-16 lg:pt-32 lg:pb-20" aria-label="Flight search">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-16">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={fadeUp} custom={0} className={cn("font-jakarta text-label-lg text-champagne-gold tracking-widest uppercase mb-3", isRtl && "tracking-normal")}>
                {locale === "en" ? "Global Air Travel" : "طيران عالمي راقٍ"}
              </motion.p>
              <motion.h1 variants={fadeUp} custom={1} className={cn("font-caslon text-display-lg-mobile md:text-headline-lg text-white mb-10", isRtl && "text-right")}>
                {locale === "en" ? "Search Premium Flights Worldwide" : "ابحث عن رحلات طيران فاخرة حول العالم"}
              </motion.h1>

              {/* Form Container */}
              <motion.div variants={fadeUp} custom={2} className="bg-white rounded-xl p-6 lg:p-8 shadow-luxury-lg">
                <form onSubmit={handleSubmit(onSearchSubmit)}>
                  {/* Trip Type Toggle */}
                  <div className={cn("flex items-center gap-2 mb-6", isRtl && "flex-row-reverse justify-end")} role="radiogroup" aria-label="Trip Type">
                    {TRIP_TYPES.map((tItem) => {
                      const localizedTrip: Record<string, string> = {
                        "Round Trip": "ذهاب وعودة",
                        "One Way": "اتجاه واحد",
                        "Multi-City": "وجهات متعددة"
                      };
                      const label = locale === "en" ? tItem.label : localizedTrip[tItem.label] || tItem.label;
                      return (
                        <button
                          key={tItem.id}
                          type="button"
                          onClick={() => setValue("tripType", tItem.label)}
                          className={cn(
                            "px-5 py-2 rounded font-jakarta text-sm font-semibold transition-all duration-300",
                            tripType === tItem.label
                              ? "bg-deep-navy text-white"
                              : "text-deep-navy border border-outline-variant hover:border-champagne-gold"
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className={cn("grid grid-cols-1 gap-4 mb-6 items-start", isRtl ? "md:grid-cols-[1fr,1fr,auto,1fr]" : "md:grid-cols-[1fr,auto,1fr,1fr]")}>
                    
                    {/* From Input in LTR (Departure) or RTL (Swap layout position) */}
                    <div className={cn("space-y-2 relative", isRtl ? "order-3" : "order-1")}>
                      <label htmlFor="airport-from" className={cn("font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block", isRtl && "text-right")}>
                        {locale === "en" ? "From" : "من"}
                      </label>
                      <div className="relative">
                        <span className={cn("material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-champagne-gold text-xl", isRtl ? "right-4" : "left-4")}>flight_takeoff</span>
                        <input
                          id="airport-from"
                          type="text"
                          value={fromValue}
                          onChange={(e) => handleFromChange(e.target.value)}
                          onBlur={() => setTimeout(() => setFromSuggestions([]), 200)}
                          placeholder={locale === "en" ? "City or airport" : "المدينة أو المطار"}
                          className={cn(
                            "w-full py-4 border border-outline-variant rounded-xl font-jakarta text-body-md text-deep-navy focus:outline-none focus:border-champagne-gold transition-colors",
                            isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                          )}
                          aria-invalid={!!errors.from}
                          aria-describedby={errors.from ? "error-from" : undefined}
                        />
                      </div>
                      {errors.from && (
                        <p id="error-from" className={cn("text-error text-xs font-jakarta mt-1", isRtl && "text-right")} role="alert">
                          {locale === "en" ? errors.from.message : "يرجى تحديد مطار مغادرة صحيح"}
                        </p>
                      )}
                      <AnimatePresence>
                        {fromSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-20 top-full left-0 right-0 bg-white rounded-xl shadow-luxury-md mt-1 overflow-hidden"
                          >
                            {fromSuggestions.map((s) => (
                              <button
                                key={s}
                                type="button"
                                className={cn("w-full px-4 py-3 font-jakarta text-sm text-deep-navy hover:bg-sand-beige transition-colors flex items-center gap-2", isRtl ? "text-right flex-row-reverse" : "text-left")}
                                onClick={() => { setValue("from", s); setFromSuggestions([]); }}
                              >
                                <span className="material-symbols-outlined text-champagne-gold text-sm">flight_takeoff</span>
                                {s}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center pt-8 order-2">
                      <button
                        onClick={swapRoutes}
                        className="w-12 h-12 rounded bg-sand-beige border border-outline-variant flex items-center justify-center text-champagne-gold hover:bg-champagne-gold hover:text-white transition-all duration-300 active:scale-95"
                        aria-label="Swap locations"
                      >
                        <span className="material-symbols-outlined text-sm">swap_horiz</span>
                      </button>
                    </div>

                    {/* To Input */}
                    <div className={cn("space-y-2 relative", isRtl ? "order-1" : "order-3")}>
                      <label htmlFor="airport-to" className={cn("font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block", isRtl && "text-right")}>
                        {locale === "en" ? "To" : "إلى"}
                      </label>
                      <div className="relative">
                        <span className={cn("material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-champagne-gold text-xl", isRtl ? "right-4" : "left-4")}>flight_land</span>
                        <input
                          id="airport-to"
                          type="text"
                          value={toValue}
                          onChange={(e) => handleToChange(e.target.value)}
                          onBlur={() => setTimeout(() => setToSuggestions([]), 200)}
                          placeholder={locale === "en" ? "City or airport" : "المدينة أو المطار"}
                          className={cn(
                            "w-full py-4 border border-outline-variant rounded-xl font-jakarta text-body-md text-deep-navy focus:outline-none focus:border-champagne-gold transition-colors",
                            isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                          )}
                          aria-invalid={!!errors.to}
                          aria-describedby={errors.to ? "error-to" : undefined}
                        />
                      </div>
                      {errors.to && (
                        <p id="error-to" className={cn("text-error text-xs font-jakarta mt-1", isRtl && "text-right")} role="alert">
                          {locale === "en" ? errors.to.message : "وجهة ومطار الوصول يجب أن يختلفا عن المغادرة"}
                        </p>
                      )}
                      <AnimatePresence>
                        {toSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-20 top-full left-0 right-0 bg-white rounded-xl shadow-luxury-md mt-1 overflow-hidden"
                          >
                            {toSuggestions.map((s) => (
                              <button
                                key={s}
                                type="button"
                                className={cn("w-full px-4 py-3 font-jakarta text-sm text-deep-navy hover:bg-sand-beige transition-colors flex items-center gap-2", isRtl ? "text-right flex-row-reverse" : "text-left")}
                                onClick={() => { setValue("to", s); setToSuggestions([]); }}
                              >
                                <span className="material-symbols-outlined text-champagne-gold text-sm">flight_land</span>
                                {s}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Cabin Class Selection */}
                    <div className="space-y-2 order-4">
                      <label htmlFor="cabin-class" className={cn("font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block", isRtl && "text-right")}>
                        {locale === "en" ? "Class" : "الدرجة"}
                      </label>
                      <div className="relative">
                        <span className={cn("material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-champagne-gold text-xl", isRtl ? "right-4" : "left-4")}>airline_seat_recline_extra</span>
                        <select
                          id="cabin-class"
                          {...register("cabinClass")}
                          className={cn(
                            "w-full py-4 border border-outline-variant rounded-xl font-jakarta text-body-md text-deep-navy focus:outline-none focus:border-champagne-gold transition-colors appearance-none bg-white",
                            isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                          )}
                        >
                          {CABIN_CLASSES.map((cOption) => {
                            const classTranslations: Record<string, string> = {
                              Economy: "الدرجة السياحية",
                              Premium: "السياحية الممتازة",
                              Business: "درجة رجال الأعمال",
                              First: "الدرجة الأولى"
                            };
                            return (
                              <option key={cOption.id} value={cOption.label}>
                                {locale === "en" ? cOption.label : classTranslations[cOption.label] || cOption.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Dates & Passengers Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <label htmlFor="depart-date" className={cn("font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block", isRtl && "text-right")}>
                        {locale === "en" ? "Depart" : "تاريخ الذهاب"}
                      </label>
                      <div className="relative">
                        <span className={cn("material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-champagne-gold text-xl", isRtl ? "right-4" : "left-4")}>calendar_today</span>
                        <input
                          id="depart-date"
                          type="date"
                          {...register("departDate")}
                          className={cn(
                            "w-full py-4 border border-outline-variant rounded-xl font-jakarta text-body-md text-deep-navy focus:outline-none focus:border-champagne-gold transition-colors",
                            isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                          )}
                          aria-invalid={!!errors.departDate}
                          aria-describedby={errors.departDate ? "error-depart" : undefined}
                        />
                      </div>
                      {errors.departDate && (
                        <p id="error-depart" className={cn("text-error text-xs font-jakarta mt-1", isRtl && "text-right")} role="alert">
                          {locale === "en" ? errors.departDate.message : "يرجى تحديد تاريخ المغادرة"}
                        </p>
                      )}
                    </div>

                    {tripType !== "One Way" && (
                      <div className="space-y-2">
                        <label htmlFor="return-date" className={cn("font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block", isRtl && "text-right")}>
                          {locale === "en" ? "Return" : "تاريخ العودة"}
                        </label>
                        <div className="relative">
                          <span className={cn("material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-champagne-gold text-xl", isRtl ? "right-4" : "left-4")}>event_available</span>
                          <input
                            id="return-date"
                            type="date"
                            {...register("returnDate")}
                            className={cn(
                              "w-full py-4 border border-outline-variant rounded-xl font-jakarta text-body-md text-deep-navy focus:outline-none focus:border-champagne-gold transition-colors",
                              isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                            )}
                            aria-invalid={!!errors.returnDate}
                            aria-describedby={errors.returnDate ? "error-return" : undefined}
                          />
                        </div>
                        {errors.returnDate && (
                          <p id="error-return" className={cn("text-error text-xs font-jakarta mt-1", isRtl && "text-right")} role="alert">
                            {locale === "en" ? errors.returnDate.message : "تاريخ العودة مطلوب للرحلات الدائرية"}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="passengers-count" className={cn("font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block", isRtl && "text-right")}>
                        {locale === "en" ? "Passengers" : "المسافرون"}
                      </label>
                      <div className="relative">
                        <span className={cn("material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-champagne-gold text-xl", isRtl ? "right-4" : "left-4")}>people</span>
                        <select
                          id="passengers-count"
                          value={passengers}
                          onChange={(e) => setValue("passengers", Number(e.target.value))}
                          className={cn(
                            "w-full py-4 border border-outline-variant rounded-xl font-jakarta text-body-md text-deep-navy focus:outline-none focus:border-champagne-gold transition-colors appearance-none bg-white",
                            isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                          )}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n}>
                              {locale === "en" ? `${n} Passenger${n > 1 ? "s" : ""}` : `${n} مسافر`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-deep-navy text-white font-jakarta font-bold py-4 rounded-xl hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-2 text-body-md shadow-luxury-md"
                  >
                    <span className="material-symbols-outlined">search</span>
                    {locale === "en" ? "Search Available Flights" : "البحث عن الرحلات المتاحة"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <section className="max-w-[1280px] mx-auto px-5 lg:px-16 py-12" aria-label="Flight results">
          <div className={cn("flex flex-col gap-8", isRtl ? "lg:flex-row-reverse" : "lg:flex-row")}>
            
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-luxury sticky top-28 border border-outline-variant/10">
                <div className={cn("flex items-center justify-between mb-6", isRtl && "flex-row-reverse")}>
                  <h2 className="font-caslon text-headline-md text-deep-navy">
                    {locale === "en" ? "Refine" : "تصفية النتائج"}
                  </h2>
                  <button
                    onClick={() => { setPriceFilter([]); setAirlineFilter([]); setStopsFilter([]); }}
                    className="font-jakarta text-label-sm text-champagne-gold font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity"
                  >
                    {locale === "en" ? "Reset" : "إعادة تعيين"}
                  </button>
                </div>

                {/* Price Range */}
                <div className={cn("mb-8", isRtl && "text-right")}>
                  <h3 className="font-jakarta font-semibold text-label-lg text-deep-navy mb-4">
                    {locale === "en" ? "Price Range" : "نطاق السعر"}
                  </h3>
                  <div className="space-y-3">
                    {(locale === "en" ? PRICE_RANGES.flights : [
                      { label: "أقل من 500$" },
                      { label: "500$ - 1500$" },
                      { label: "أكثر من 1500$" }
                    ]).map((r) => (
                      <label key={r.label} className={cn("flex items-center gap-3 cursor-pointer group", isRtl && "flex-row-reverse")}>
                        <input
                          type="checkbox"
                          checked={priceFilter.includes(r.label)}
                          onChange={(e) => setPriceFilter((prev) => e.target.checked ? [...prev, r.label] : prev.filter((x) => x !== r.label))}
                          className="w-4 h-4 rounded border-outline-variant text-champagne-gold focus:ring-champagne-gold accent-champagne-gold"
                        />
                        <span className="font-jakarta text-body-md text-on-surface-variant group-hover:text-deep-navy text-sm">{r.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Airlines */}
                <div className={cn("mb-8", isRtl && "text-right")}>
                  <h3 className="font-jakarta font-semibold text-label-lg text-deep-navy mb-4">
                    {locale === "en" ? "Airline" : "خطوط الطيران"}
                  </h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {MAJOR_AIRLINES.map((a) => {
                      const localizedAirline: Record<string, string> = {
                        "Emirates": "طيران الإمارات",
                        "Qatar Airways": "الخطوط الجوية القطرية",
                        "Etihad Airways": "الاتحاد للطيران",
                        "Singapore Airlines": "الخطوط الجوية السنغافورية",
                        "Lufthansa": "لوفتهانزا",
                        "British Airways": "الخطوط الجوية البريطانية",
                        "Air France": "الخطوط الجوية الفرنسية",
                        "Turkish Airlines": "الخطوط الجوية التركية",
                        "EgyptAir": "مصر للطيران",
                        "Air China": "طيران الصين",
                        "Japan Airlines": "الخطوط الجوية اليابانية",
                        "Korean Air": "الخطوط الكورية",
                        "Cathay Pacific": "كاثي باسيفيك",
                        "Delta Air Lines": "دلتا إيرلاينز",
                        "United Airlines": "يونايتد إيرلاينز"
                      };
                      return (
                        <label key={a} className={cn("flex items-center gap-3 cursor-pointer group", isRtl && "flex-row-reverse")}>
                          <input
                            type="checkbox"
                            checked={airlineFilter.includes(a)}
                            onChange={(e) => setAirlineFilter((prev) => e.target.checked ? [...prev, a] : prev.filter((x) => x !== a))}
                            className="w-4 h-4 rounded border-outline-variant text-champagne-gold focus:ring-champagne-gold accent-champagne-gold"
                          />
                          <span className="font-jakarta text-body-md text-on-surface-variant group-hover:text-deep-navy text-sm">
                            {locale === "en" ? a : localizedAirline[a] || a}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Stops */}
                <div className={isRtl ? "text-right" : "text-left"}>
                  <h3 className="font-jakarta font-semibold text-label-lg text-deep-navy mb-4">
                    {locale === "en" ? "Stops" : "محطات التوقف"}
                  </h3>
                  <div className="space-y-3">
                    {(locale === "en" ? ["Non-stop", "1 Stop", "2+ Stops"] : ["بدون توقف", "توقف واحد", "توقفين أو أكثر"]).map((s) => (
                      <label key={s} className={cn("flex items-center gap-3 cursor-pointer group", isRtl && "flex-row-reverse")}>
                        <input
                          type="checkbox"
                          checked={stopsFilter.includes(s)}
                          onChange={(e) => setStopsFilter((prev) => e.target.checked ? [...prev, s] : prev.filter((x) => x !== s))}
                          className="w-4 h-4 rounded border-outline-variant text-champagne-gold focus:ring-champagne-gold accent-champagne-gold"
                        />
                        <span className="font-jakarta text-body-md text-on-surface-variant group-hover:text-deep-navy text-sm">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Flight List */}
            <div className="flex-1 space-y-4">
              <div className={cn("flex items-center justify-between mb-6", isRtl && "flex-row-reverse")}>
                <p className="font-jakarta text-body-md text-on-surface-variant" aria-live="polite">
                  <span className="font-bold text-deep-navy">{displayedFlights.length}</span>{" "}
                  {searched 
                    ? (locale === "en" ? "flights found" : "رحلة تم العثور عليها") 
                    : (locale === "en" ? "featured routes" : "وجهات مميزة")}
                </p>
                <select className="font-jakarta text-sm border border-outline-variant rounded-xl px-4 py-2 text-deep-navy focus:outline-none focus:border-champagne-gold bg-white" aria-label="Sort flights">
                  <option>{locale === "en" ? "Sort: Best Value" : "ترتيب: القيمة الأفضل"}</option>
                  <option>{locale === "en" ? "Sort: Lowest Price" : "ترتيب: السعر الأقل"}</option>
                  <option>{locale === "en" ? "Sort: Shortest Duration" : "ترتيب: المدة الأقصر"}</option>
                  <option>{locale === "en" ? "Sort: Departure Time" : "ترتيب: موعد الإقلاع"}</option>
                </select>
              </div>

              <AnimatePresence mode="wait">
                {loadingFlights ? (
                  <div className="py-20 flex justify-center items-center">
                    <div className="w-8 h-8 border-2 border-champagne-gold border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : displayedFlights.length > 0 ? (
                  <motion.div key="flights-list" className="space-y-4">
                    {displayedFlights.map((flight, i) => (
                      <motion.div
                        key={flight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={cn(
                          "bg-white rounded-xl p-6 shadow-luxury hover:shadow-luxury-md transition-all duration-300 cursor-pointer border-2",
                          selectedFlight === flight.id ? "border-champagne-gold" : "border-transparent"
                        )}
                        onClick={() => setSelectedFlight(flight.id)}
                        role="button"
                        aria-pressed={selectedFlight === flight.id}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setSelectedFlight(flight.id)}
                      >
                        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4", isRtl && "md:flex-row-reverse")}>
                          {/* Airline */}
                          <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse text-right")}>
                            <div className="w-12 h-12 rounded-xl bg-sand-beige flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-champagne-gold text-xl">flight</span>
                            </div>
                            <div>
                              <p className="font-jakarta font-bold text-deep-navy text-sm">{flight.airline}</p>
                              <p className="font-jakarta text-label-sm text-outline">{flight.flightNumber}</p>
                            </div>
                          </div>

                          {/* Route Map */}
                          <div className={cn("flex items-center gap-4 flex-1 justify-center", isRtl && "flex-row-reverse")}>
                            <div className="text-center">
                              <p className="font-caslon text-headline-md text-deep-navy">{flight.departure}</p>
                              <p className="font-jakarta text-label-sm text-outline">{flight.fromCode}</p>
                              <p className="font-jakarta text-xs text-on-surface-variant">{flight.fromCity}</p>
                            </div>
                            <div className="flex-1 max-w-32 flex flex-col items-center gap-1">
                              <p className="font-jakarta text-label-sm text-outline">
                                {locale === "en" ? flight.duration : flight.duration.replace("h", " س").replace("m", " د")}
                              </p>
                              <div className={cn("flex items-center gap-1 w-full", isRtl && "flex-row-reverse")}>
                                <div className="h-px flex-1 bg-outline-variant" />
                                <span className={cn("material-symbols-outlined text-champagne-gold text-sm", isRtl && "rotate-180")}>flight</span>
                                <div className="h-px flex-1 bg-outline-variant" />
                              </div>
                              <p className="font-jakarta text-label-sm text-champagne-gold font-semibold">
                                {flight.stops === 0 
                                  ? (locale === "en" ? "Non-stop" : "بدون توقف") 
                                  : (locale === "en" ? `${flight.stops} stop` : `${flight.stops} توقف`)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-caslon text-headline-md text-deep-navy">{flight.arrival}</p>
                              <p className="font-jakarta text-label-sm text-outline">{flight.toCode}</p>
                              <p className="font-jakarta text-xs text-on-surface-variant">{flight.toCity}</p>
                            </div>
                          </div>

                          {/* Price details */}
                          <div className={cn("flex items-center gap-4 md:gap-6", isRtl && "flex-row-reverse text-left")}>
                            <div className={isRtl ? "text-left" : "text-right"}>
                              <p className="font-caslon text-headline-md text-champagne-gold">${flight.price.toLocaleString()}</p>
                              <p className="font-jakarta text-label-sm text-outline font-medium">
                                {locale === "en" ? flight.class : (flight.class === "Business Class" ? "درجة رجال الأعمال" : "الدرجة الأولى")}
                              </p>
                              <p className="font-jakarta text-[11px] text-error font-bold">
                                {locale === "en" ? `${flight.seats} seats left` : `متبقي ${flight.seats} مقاعد فقط`}
                              </p>
                            </div>
                            <button
                              onClick={(e) => handleBookFlight(flight, e)}
                              className="bg-deep-navy text-white font-jakarta font-bold px-6 py-3 rounded text-sm hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95 whitespace-nowrap"
                            >
                              {locale === "en" ? "Select" : "حجز"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    key="empty-state"
                    title={locale === "en" ? "No Flights Found" : "لم يتم العثور على رحلات"}
                    description={locale === "en" 
                      ? "We couldn't find any flights matching your active filters. Try removing search constraints or choosing other dates."
                      : "لم نتمكن من العثور على رحلات مطابقة للتصفية الحالية. يرجى تجربة إعادة ضبط خيارات البحث."}
                    actionLabel={locale === "en" ? "Clear All Filters" : "إلغاء التصفية"}
                    onAction={() => {
                      setPriceFilter([]);
                      setAirlineFilter([]);
                      setStopsFilter([]);
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
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
                  ? `Your flight request for ${bookedRequest.title} has been saved. An email confirmation has been logged, and an advisor is reviewing your reservation.`
                  : `تم حفظ طلب حجز الطيران الخاص بك لـ ${bookedRequest.title}. تم إرسال إشعار بريد إلكتروني، ويقوم مستشار السفر لدينا بمراجعة طلبك وتأكيده.`}
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
