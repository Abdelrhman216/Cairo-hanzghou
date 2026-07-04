/**
 * Site Content Data Layer
 * All content consumed by pages. Country-specific logic is driven by
 * COUNTRIES config — no hardcoded country names in component logic.
 *
 * Cairo Hangzhou brand identity is intentionally preserved:
 *  - The company name and its historical roots remain
 *  - Services and destinations are global
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Destination {
  id: string;
  name: string;
  location: string;       // "City, Country"
  countryCode: string;    // ISO 3166-1 alpha-2
  continent: string;
  category: string;
  categoryStyle: "gold" | "glass";
  image: string;
  description: string;
  price: string;
  duration: string;
  rating: number;
}

export interface TravelPackage {
  id: string;
  title: string;
  subtitle: string;
  destinations: string[];  // array of countryCode or city names (global)
  destinationLabel: string; // display string e.g. "Japan & South Korea"
  continent: string;
  duration: string;
  groupSize: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  includes: string[];
  tag: string;
  tagColor: "gold" | "glass";
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  countryCode: string;
  continent: string;
  stars: number;
  rating: number;
  reviews: number;
  price: number;          // per night USD
  image: string;
  amenities: string[];
  description: string;
  category: string;
}

export interface FlightRoute {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  fromCity: string;
  fromCode: string;       // IATA airport code
  toCity: string;
  toCode: string;
  from: string;           // display: "City (IATA)"
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  class: string;
  price: number;
  seats: number;
}

export interface VisaDestination {
  id: string;
  countryCode: string;
  name: string;
  flag: string;
  subtitle: string;
  image: string;
  processingTime: string;
  fee: string;
  feeUSD: number;
  validity: string;
  visaTypes: string[];
  popular: boolean;
  requirements?: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  country: string;
  countryCode: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface Stat {
  label: string;
  value: string;
  icon: string;
}

// ── Featured Destinations (global sample) ─────────────────────────────────────

export const destinations: Destination[] = [
  {
    id: "giza-necropolis",
    name: "Giza Necropolis",
    location: "Cairo, Egypt",
    countryCode: "EG",
    continent: "Africa",
    category: "Exclusive",
    categoryStyle: "gold",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZRZiX9Id_TakubrgI7F4G90XQIulJHai72DrL_qRYiHRgPch5jWjQmcw1JWnNKUihwfRTaDuq-yzk1mbZgsby8Vp-O3BeTH1AKnjCZmfyJ1pRO-KsbfUyiJMz0v_PpPxPNn_yJ_C3zD6CC6FYra2DmKXK7jSr7gu3looUfHWcOhSrhkoJcDDB11gcj_Rtv3Ovt4CA-Z5tGxWkl056yZBdZNocR1cyqc1uI86oGuRb1ztrc_epf_SATmf89CfC-IstAS49Wi-Bcz4",
    description: "Witness the last surviving wonder of the ancient world in breathtaking grandeur.",
    price: "From $1,200",
    duration: "7 nights",
    rating: 4.9,
  },
  {
    id: "west-lake-hangzhou",
    name: "Lush Longjing",
    location: "Hangzhou, China",
    countryCode: "CN",
    continent: "Asia",
    category: "Nature",
    categoryStyle: "glass",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2muXSASaCtxjQ9vspnQcQuHYbO9cK2A_LSC6skg-53drf5CDmGjbblGjavkjQDC4L1y3kM119sWICru8Y6S4e_nuePl_eW41DT2TTvwv0KoIXEaTNHlLIbB0eAnKkhN9aELWlTrBd1oKfHEo_WMRTnGimzrxTuJASeFYK9WRP5DTBckysXYI8zhECcN7gsyM_GV3Ludi2oXuEL1eOgvP9jCxtDaVDsU7REZoi6WdjExg2nl6uu5uItubD5lEnF-BJUkcMDMbcpS0",
    description: "Immerse in the serene beauty of West Lake's misty pavilions and silk-smooth tea fields.",
    price: "From $1,500",
    duration: "8 nights",
    rating: 4.8,
  },
  {
    id: "santorini-caldera",
    name: "Santorini Caldera",
    location: "Santorini, Greece",
    countryCode: "GR",
    continent: "Europe",
    category: "Luxury",
    categoryStyle: "glass",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHLCcra86FJEIsIzLopb5GlIdxhtCWwGC4rsKoR3a4xujTJE4AmbQ8OyMhZyGIi64T9rWb2qIeQhbn0yBpBChECVrWQDVC1wHu61PZ-62jUVEEvt5e0Y6pyxrzyeTebm5o6IGvvDvYNecmzpNJ1vPWTMImpsMc58jNsMgQ3eiHOfyIqWOHpa-OAYyiT_SsqRKefTEuvj9nAKbohZmkNhoP6ZmzK3iznMgxWDy5uQQlr1XrNHlAYpYl2STuACMnU78Ai-BPjiuVg",
    description: "Iconic blue-domed vistas and volcanic sunsets above the Aegean Sea.",
    price: "From $2,100",
    duration: "6 nights",
    rating: 4.9,
  },
  {
    id: "kyoto-temples",
    name: "Kyoto Temples",
    location: "Kyoto, Japan",
    countryCode: "JP",
    continent: "Asia",
    category: "Culture",
    categoryStyle: "glass",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq_YAuQ57YyhqSqLckh7KI7ydRovhJJdHs8B0mNWUkgvrqhX1Y7-1RdB8-eRGAQT3B57vc2KxVyQaoBiNeQUOU655XTU_TPE9d6RdQsxT_vSGOCg7VbeBY7zXQlNhYRJSLdRSikzE6AqzDETmtY1elZxj24NRlRys8xTEC_KHKUyoJZ9JLTB00jFGM8hWUaTWiX7Ew6BV-F9S-JBvYoSMYn_CE9V1Cfu2Y1AepmCAgegg_twEnbhi4Y7plOYdWJmnjHszn9Q1id6k",
    description: "Wander through centuries of samurai history, golden pavilions, and cherry blossoms.",
    price: "From $1,800",
    duration: "10 nights",
    rating: 5.0,
  },
  {
    id: "dubai-marina",
    name: "Dubai Marina",
    location: "Dubai, UAE",
    countryCode: "AE",
    continent: "Asia",
    category: "Modern",
    categoryStyle: "glass",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHLCcra86FJEIsIzLopb5GlIdxhtCWwGC4rsKoR3a4xujTJE4AmbQ8OyMhZyGIi64T9rWb2qIeQhbn0yBpBChECVrWQDVC1wHu61PZ-62jUVEEvt5e0Y6pyxrzyeTebm5o6IGvvDvYNecmzpNJ1vPWTMImpsMc58jNsMgQ3eiHOfyIqWOHpa-OAYyiT_SsqRKefTEuvj9nAKbohZmkNhoP6ZmzK3iznMgxWDy5uQQlr1XrNHlAYpYl2STuACMnU78Ai-BPjiuVg",
    description: "The future of luxury — towering skylines, world-record hotels, and desert adventures.",
    price: "From $1,100",
    duration: "5 nights",
    rating: 4.8,
  },
  {
    id: "maldives-atoll",
    name: "Maldives Overwater",
    location: "North Malé Atoll, Maldives",
    countryCode: "MV",
    continent: "Asia",
    category: "Serenity",
    categoryStyle: "gold",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2muXSASaCtxjQ9vspnQcQuHYbO9cK2A_LSC6skg-53drf5CDmGjbblGjavkjQDC4L1y3kM119sWICru8Y6S4e_nuePl_eW41DT2TTvwv0KoIXEaTNHlLIbB0eAnKkhN9aELWlTrBd1oKfHEo_WMRTnGimzrxTuJASeFYK9WRP5DTBckysXYI8zhECcN7gsyM_GV3Ludi2oXuEL1eOgvP9jCxtDaVDsU7REZoi6WdjExg2nl6uu5uItubD5lEnF-BJUkcMDMbcpS0",
    description: "Crystal-clear lagoons, overwater bungalows, and absolute tranquility in the Indian Ocean.",
    price: "From $2,800",
    duration: "7 nights",
    rating: 5.0,
  },
];

// ── Travel Packages (worldwide) ───────────────────────────────────────────────

export const packages: TravelPackage[] = [
  {
    id: "pharaohs-legacy",
    title: "Pharaoh's Legacy",
    subtitle: "The Essential Egypt Experience",
    destinations: ["EG"],
    destinationLabel: "Egypt",
    continent: "Africa",
    duration: "7 Days / 6 Nights",
    groupSize: "2–12 people",
    price: 2890,
    originalPrice: 3400,
    rating: 4.9,
    reviews: 128,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZRZiX9Id_TakubrgI7F4G90XQIulJHai72DrL_qRYiHRgPch5jWjQmcw1JWnNKUihwfRTaDuq-yzk1mbZgsby8Vp-O3BeTH1AKnjCZmfyJ1pRO-KsbfUyiJMz0v_PpPxPNn_yJ_C3zD6CC6FYra2DmKXK7jSr7gu3looUfHWcOhSrhkoJcDDB11gcj_Rtv3Ovt4CA-Z5tGxWkl056yZBdZNocR1cyqc1uI86oGuRb1ztrc_epf_SATmf89CfC-IstAS49Wi-Bcz4",
    highlights: ["Great Pyramids of Giza", "Egyptian Museum", "Nile Dinner Cruise", "Valley of the Kings", "Luxor Temple"],
    includes: ["5-Star Hotel", "Private Transfer", "Expert Guide", "Daily Breakfast", "Airport Transfer"],
    tag: "Best Seller",
    tagColor: "gold",
  },
  {
    id: "silk-road-serenity",
    title: "Silk Road Serenity",
    subtitle: "Hangzhou & Shanghai Cultural Immersion",
    destinations: ["CN"],
    destinationLabel: "China",
    continent: "Asia",
    duration: "8 Days / 7 Nights",
    groupSize: "2–8 people",
    price: 3200,
    originalPrice: 3800,
    rating: 4.8,
    reviews: 94,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2muXSASaCtxjQ9vspnQcQuHYbO9cK2A_LSC6skg-53drf5CDmGjbblGjavkjQDC4L1y3kM119sWICru8Y6S4e_nuePl_eW41DT2TTvwv0KoIXEaTNHlLIbB0eAnKkhN9aELWlTrBd1oKfHEo_WMRTnGimzrxTuJASeFYK9WRP5DTBckysXYI8zhECcN7gsyM_GV3Ludi2oXuEL1eOgvP9jCxtDaVDsU7REZoi6WdjExg2nl6uu5uItubD5lEnF-BJUkcMDMbcpS0",
    highlights: ["West Lake Boat Tour", "Longjing Tea Ceremony", "Lingyin Temple", "Silk Museum", "Traditional Cuisine"],
    includes: ["Boutique Hotel", "Private Transfer", "Tea Master", "Daily Meals", "Airport Transfer"],
    tag: "New",
    tagColor: "glass",
  },
  {
    id: "japan-sakura",
    title: "Japan Sakura Trail",
    subtitle: "Tokyo, Kyoto & Osaka in Full Bloom",
    destinations: ["JP"],
    destinationLabel: "Japan",
    continent: "Asia",
    duration: "10 Days / 9 Nights",
    groupSize: "2–8 people",
    price: 4500,
    originalPrice: 5200,
    rating: 4.9,
    reviews: 87,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq_YAuQ57YyhqSqLckh7KI7ydRovhJJdHs8B0mNWUkgvrqhX1Y7-1RdB8-eRGAQT3B57vc2KxVyQaoBiNeQUOU655XTU_TPE9d6RdQsxT_vSGOCg7VbeBY7zXQlNhYRJSLdRSikzE6AqzDETmtY1elZxj24NRlRys8xTEC_KHKUyoJZ9JLTB00jFGM8hWUaTWiX7Ew6BV-F9S-JBvYoSMYn_CE9V1Cfu2Y1AepmCAgegg_twEnbhi4Y7plOYdWJmnjHszn9Q1id6k",
    highlights: ["Mount Fuji Day Trip", "Fushimi Inari Shrine", "Nishiki Market", "Bullet Train (Shinkansen)", "Osaka Street Food Tour"],
    includes: ["Ryokan & City Hotels", "JR Rail Pass", "Expert English Guide", "Daily Breakfast", "Visa Assistance"],
    tag: "Trending",
    tagColor: "gold",
  },
  {
    id: "dual-civilization",
    title: "Dual Civilization",
    subtitle: "Egypt & China — Two Ancient Worlds",
    destinations: ["EG", "CN"],
    destinationLabel: "Egypt + China",
    continent: "Africa & Asia",
    duration: "15 Days / 14 Nights",
    groupSize: "2–6 people",
    price: 5900,
    originalPrice: 7200,
    rating: 5.0,
    reviews: 52,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHLCcra86FJEIsIzLopb5GlIdxhtCWwGC4rsKoR3a4xujTJE4AmbQ8OyMhZyGIi64T9rWb2qIeQhbn0yBpBChECVrWQDVC1wHu61PZ-62jUVEEvt5e0Y6pyxrzyeTebm5o6IGvvDvYNecmzpNJ1vPWTMImpsMc58jNsMgQ3eiHOfyIqWOHpa-OAYyiT_SsqRKefTEuvj9nAKbohZmkNhoP6ZmzK3iznMgxWDy5uQQlr1XrNHlAYpYl2STuACMnU78Ai-BPjiuVg",
    highlights: ["Cairo & Giza Pyramids", "Luxor Valley of Kings", "Hangzhou West Lake", "Shanghai City Tour", "Dual-Country Visa Assistance"],
    includes: ["5-Star Hotels", "All Transfers", "Dual-Country Visa Included", "Full-Board Meals", "Dedicated Concierge"],
    tag: "Premium",
    tagColor: "gold",
  },
  {
    id: "mediterranean-odyssey",
    title: "Mediterranean Odyssey",
    subtitle: "Greece, Italy & Spain in One Journey",
    destinations: ["GR", "IT", "ES"],
    destinationLabel: "Greece, Italy & Spain",
    continent: "Europe",
    duration: "14 Days / 13 Nights",
    groupSize: "2–10 people",
    price: 5200,
    originalPrice: 6100,
    rating: 4.8,
    reviews: 63,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHLCcra86FJEIsIzLopb5GlIdxhtCWwGC4rsKoR3a4xujTJE4AmbQ8OyMhZyGIi64T9rWb2qIeQhbn0yBpBChECVrWQDVC1wHu61PZ-62jUVEEvt5e0Y6pyxrzyeTebm5o6IGvvDvYNecmzpNJ1vPWTMImpsMc58jNsMgQ3eiHOfyIqWOHpa-OAYyiT_SsqRKefTEuvj9nAKbohZmkNhoP6ZmzK3iznMgxWDy5uQQlr1XrNHlAYpYl2STuACMnU78Ai-BPjiuVg",
    highlights: ["Santorini Sunset", "Colosseum Rome", "Barcelona's Sagrada Família", "Amalfi Coast Drive", "Athens Acropolis"],
    includes: ["Boutique Hotels", "Intra-Europe Flights", "Expert Guide", "Daily Breakfast", "Schengen Visa Assistance"],
    tag: "Popular",
    tagColor: "glass",
  },
  {
    id: "nile-luxury-cruise",
    title: "Nile Luxury Cruise",
    subtitle: "Sailing Ancient Wonders",
    destinations: ["EG"],
    destinationLabel: "Egypt",
    continent: "Africa",
    duration: "5 Days / 4 Nights",
    groupSize: "2–4 people",
    price: 1890,
    originalPrice: 2200,
    rating: 4.9,
    reviews: 176,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHLCcra86FJEIsIzLopb5GlIdxhtCWwGC4rsKoR3a4xujTJE4AmbQ8OyMhZyGIi64T9rWb2qIeQhbn0yBpBChECVrWQDVC1wHu61PZ-62jUVEEvt5e0Y6pyxrzyeTebm5o6IGvvDvYNecmzpNJ1vPWTMImpsMc58jNsMgQ3eiHOfyIqWOHpa-OAYyiT_SsqRKefTEuvj9nAKbohZmkNhoP6ZmzK3iznMgxWDy5uQQlr1XrNHlAYpYl2STuACMnU78Ai-BPjiuVg",
    highlights: ["5-Star Cruise Ship", "Kom Ombo Temple", "Edfu Temple", "Aswan High Dam", "Nubian Village"],
    includes: ["Deluxe Cabin", "All Meals", "Shore Excursions", "Egyptologist Guide", "Transfers"],
    tag: "Signature",
    tagColor: "glass",
  },
];

// ── Hotels (worldwide) ────────────────────────────────────────────────────────

export const hotels: Hotel[] = [
  {
    id: "four-seasons-cairo",
    name: "Four Seasons at The First Residence",
    location: "Cairo, Egypt",
    city: "Cairo",
    countryCode: "EG",
    continent: "Africa",
    stars: 5,
    rating: 4.9,
    reviews: 842,
    price: 420,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAe_56eYI0Ruuhoqx-c1xuEE9Bo4gdfuvMEKLMxarHg2JCkQW_3szkZb11H-G-rwogMR48SkNO4Bij2uvCHNkoiAeaTlaumMYIHP1Gn_vDdmfU20Dswsb_Jt5krwikprBVR0hwzkCBIJjNpFMjApbzU45CoRa9A0it-eqRuq8tRpw1vM3JWeGQN85tuuexa6Nb5wtEc2j6CXQeycJmgo6gkHRgLkOz4_K9iGOJ_wKYQr63EflSvEYrfL8l8SZf0xYmkpeT2V23LSE",
    amenities: ["Nile View", "Spa", "Pool", "Fine Dining", "Concierge"],
    description: "Overlooking the magnificent Nile River with unparalleled views of the Giza Pyramids.",
    category: "Ultra-Luxe",
  },
  {
    id: "ritz-carlton-hangzhou",
    name: "The Ritz-Carlton, Hangzhou",
    location: "Hangzhou, China",
    city: "Hangzhou",
    countryCode: "CN",
    continent: "Asia",
    stars: 5,
    rating: 4.8,
    reviews: 614,
    price: 580,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq_YAuQ57YyhqSqLckh7KI7ydRovhJJdHs8B0mNWUkgvrqhX1Y7-1RdB8-eRGAQT3B57vc2KxVyQaoBiNeQUOU655XTU_TPE9d6RdQsxT_vSGOCg7VbeBY7zXQlNhYRJSLdRSikzE6AqzDETmtY1elZxj24NRlRys8xTEC_KHKUyoJZ9JLTB00jFGM8hWUaTWiX7Ew6BV-F9S-JBvYoSMYn_CE9V1Cfu2Y1AepmCAgegg_twEnbhi4Y7plOYdWJmnjHszn9Q1id6k",
    amenities: ["West Lake View", "Infinity Pool", "Tea House", "Spa", "Michelin Restaurant"],
    description: "Perched above West Lake with panoramic views and world-class Chinese hospitality.",
    category: "Ultra-Luxe",
  },
  {
    id: "burj-al-arab",
    name: "Burj Al Arab Jumeirah",
    location: "Dubai, UAE",
    city: "Dubai",
    countryCode: "AE",
    continent: "Asia",
    stars: 5,
    rating: 5.0,
    reviews: 1240,
    price: 1800,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHLCcra86FJEIsIzLopb5GlIdxhtCWwGC4rsKoR3a4xujTJE4AmbQ8OyMhZyGIi64T9rWb2qIeQhbn0yBpBChECVrWQDVC1wHu61PZ-62jUVEEvt5e0Y6pyxrzyeTebm5o6IGvvDvYNecmzpNJ1vPWTMImpsMc58jNsMgQ3eiHOfyIqWOHpa-OAYyiT_SsqRKefTEuvj9nAKbohZmkNhoP6ZmzK3iznMgxWDy5uQQlr1XrNHlAYpYl2STuACMnU78Ai-BPjiuVg",
    amenities: ["Private Beach", "Helicopter Pad", "Spa", "Fine Dining", "Butler Service"],
    description: "The world's most iconic sail-shaped luxury hotel rising from its own island in the Arabian Gulf.",
    category: "Ultra-Luxe",
  },
  {
    id: "park-hyatt-tokyo",
    name: "Park Hyatt Tokyo",
    location: "Shinjuku, Japan",
    city: "Tokyo",
    countryCode: "JP",
    continent: "Asia",
    stars: 5,
    rating: 4.9,
    reviews: 780,
    price: 620,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2muXSASaCtxjQ9vspnQcQuHYbO9cK2A_LSC6skg-53drf5CDmGjbblGjavkjQDC4L1y3kM119sWICru8Y6S4e_nuePl_eW41DT2TTvwv0KoIXEaTNHlLIbB0eAnKkhN9aELWlTrBd1oKfHEo_WMRTnGimzrxTuJASeFYK9WRP5DTBckysXYI8zhECcN7gsyM_GV3Ludi2oXuEL1eOgvP9jCxtDaVDsU7REZoi6WdjExg2nl6uu5uItubD5lEnF-BJUkcMDMbcpS0",
    amenities: ["Mt. Fuji View", "Rooftop Pool", "Fitness Club", "Jazz Bar", "Fine Dining"],
    description: "Dramatic city views from 39 floors above Shinjuku — the urban sanctuary made famous by Lost in Translation.",
    category: "Urban Luxe",
  },
  {
    id: "four-seasons-paris",
    name: "Four Seasons Hotel George V",
    location: "Paris, France",
    city: "Paris",
    countryCode: "FR",
    continent: "Europe",
    stars: 5,
    rating: 4.9,
    reviews: 920,
    price: 1100,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHLCcra86FJEIsIzLopb5GlIdxhtCWwGC4rsKoR3a4xujTJE4AmbQ8OyMhZyGIi64T9rWb2qIeQhbn0yBpBChECVrWQDVC1wHu61PZ-62jUVEEvt5e0Y6pyxrzyeTebm5o6IGvvDvYNecmzpNJ1vPWTMImpsMc58jNsMgQ3eiHOfyIqWOHpa-OAYyiT_SsqRKefTEuvj9nAKbohZmkNhoP6ZmzK3iznMgxWDy5uQQlr1XrNHlAYpYl2STuACMnU78Ai-BPjiuVg",
    amenities: ["Eiffel Tower View", "Spa", "3 Michelin-Star Restaurant", "Pool", "Concierge"],
    description: "A timeless Art Deco palace steps from the Champs-Élysées, renowned for floral artistry and French grandeur.",
    category: "Heritage Luxe",
  },
  {
    id: "waldorf-new-york",
    name: "Waldorf Astoria New York",
    location: "New York City, USA",
    city: "New York",
    countryCode: "US",
    continent: "North America",
    stars: 5,
    rating: 4.8,
    reviews: 1050,
    price: 850,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZRZiX9Id_TakubrgI7F4G90XQIulJHai72DrL_qRYiHRgPch5jWjQmcw1JWnNKUihwfRTaDuq-yzk1mbZgsby8Vp-O3BeTH1AKnjCZmfyJ1pRO-KsbfUyiJMz0v_PpPxPNn_yJ_C3zD6CC6FYra2DmKXK7jSr7gu3looUfHWcOhSrhkoJcDDB11gcj_Rtv3Ovt4CA-Z5tGxWkl056yZBdZNocR1cyqc1uI86oGuRb1ztrc_epf_SATmf89CfC-IstAS49Wi-Bcz4",
    amenities: ["Park Avenue Address", "Spa", "Fine Dining", "Fitness Center", "Historic Grandeur"],
    description: "An Art Deco icon rising above Midtown Manhattan — history, elegance, and prestige in every corridor.",
    category: "Heritage Luxe",
  },
];

// ── Flight Routes (global sample) ─────────────────────────────────────────────

export const flightRoutes: FlightRoute[] = [
  {
    id: "cai-dxb-1",
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK 924",
    fromCity: "Cairo",
    fromCode: "CAI",
    toCity: "Dubai",
    toCode: "DXB",
    from: "Cairo (CAI)",
    to: "Dubai (DXB)",
    departure: "08:00",
    arrival: "12:30",
    duration: "3h 30m",
    stops: 0,
    class: "Business",
    price: 980,
    seats: 6,
  },
  {
    id: "lhr-jfk-1",
    airline: "British Airways",
    airlineCode: "BA",
    flightNumber: "BA 117",
    fromCity: "London",
    fromCode: "LHR",
    toCity: "New York",
    toCode: "JFK",
    from: "London (LHR)",
    to: "New York (JFK)",
    departure: "11:30",
    arrival: "14:15",
    duration: "7h 45m",
    stops: 0,
    class: "First",
    price: 4200,
    seats: 2,
  },
  {
    id: "cai-hgh-1",
    airline: "EgyptAir",
    airlineCode: "MS",
    flightNumber: "MS 895",
    fromCity: "Cairo",
    fromCode: "CAI",
    toCity: "Hangzhou",
    toCode: "HGH",
    from: "Cairo (CAI)",
    to: "Hangzhou (HGH)",
    departure: "09:30",
    arrival: "23:45",
    duration: "10h 15m",
    stops: 0,
    class: "Business",
    price: 2840,
    seats: 3,
  },
  {
    id: "sin-syd-1",
    airline: "Singapore Airlines",
    airlineCode: "SQ",
    flightNumber: "SQ 231",
    fromCity: "Singapore",
    fromCode: "SIN",
    toCity: "Sydney",
    toCode: "SYD",
    from: "Singapore (SIN)",
    to: "Sydney (SYD)",
    departure: "18:00",
    arrival: "05:30+1",
    duration: "8h 30m",
    stops: 0,
    class: "Business",
    price: 3100,
    seats: 4,
  },
  {
    id: "cdg-nrt-1",
    airline: "Air France",
    airlineCode: "AF",
    flightNumber: "AF 275",
    fromCity: "Paris",
    fromCode: "CDG",
    toCity: "Tokyo",
    toCode: "NRT",
    from: "Paris (CDG)",
    to: "Tokyo (NRT)",
    departure: "13:45",
    arrival: "10:30+1",
    duration: "12h 45m",
    stops: 0,
    class: "Business",
    price: 3800,
    seats: 5,
  },
];

// ── Visa Destinations (global) ────────────────────────────────────────────────

export const visaDestinations: VisaDestination[] = [
  {
    id: "china",
    countryCode: "CN",
    name: "China",
    flag: "🇨🇳",
    subtitle: "Tourist, Business & Student Visas",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq_YAuQ57YyhqSqLckh7KI7ydRovhJJdHs8B0mNWUkgvrqhX1Y7-1RdB8-eRGAQT3B57vc2KxVyQaoBiNeQUOU655XTU_TPE9d6RdQsxT_vSGOCg7VbeBY7zXQlNhYRJSLdRSikzE6AqzDETmtY1elZxj24NRlRys8xTEC_KHKUyoJZ9JLTB00jFGM8hWUaTWiX7Ew6BV-F9S-JBvYoSMYn_CE9V1Cfu2Y1AepmCAgegg_twEnbhi4Y7plOYdWJmnjHszn9Q1id6k",
    processingTime: "3–5 business days",
    fee: "$120",
    feeUSD: 120,
    validity: "30 days / 90 days",
    visaTypes: ["tourist", "business", "student"],
    popular: true,
  },
  {
    id: "uae",
    countryCode: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    subtitle: "Tourist & Business Visas",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHLCcra86FJEIsIzLopb5GlIdxhtCWwGC4rsKoR3a4xujTJE4AmbQ8OyMhZyGIi64T9rWb2qIeQhbn0yBpBChECVrWQDVC1wHu61PZ-62jUVEEvt5e0Y6pyxrzyeTebm5o6IGvvDvYNecmzpNJ1vPWTMImpsMc58jNsMgQ3eiHOfyIqWOHpa-OAYyiT_SsqRKefTEuvj9nAKbohZmkNhoP6ZmzK3iznMgxWDy5uQQlr1XrNHlAYpYl2STuACMnU78Ai-BPjiuVg",
    processingTime: "1–3 business days",
    fee: "$85",
    feeUSD: 85,
    validity: "30 days / 90 days",
    visaTypes: ["tourist", "business", "transit"],
    popular: true,
  },
  {
    id: "uk",
    countryCode: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    subtitle: "Standard Visitor, Student & Work Visas",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHLCcra86FJEIsIzLopb5GlIdxhtCWwGC4rsKoR3a4xujTJE4AmbQ8OyMhZyGIi64T9rWb2qIeQhbn0yBpBChECVrWQDVC1wHu61PZ-62jUVEEvt5e0Y6pyxrzyeTebm5o6IGvvDvYNecmzpNJ1vPWTMImpsMc58jNsMgQ3eiHOfyIqWOHpa-OAYyiT_SsqRKefTEuvj9nAKbohZmkNhoP6ZmzK3iznMgxWDy5uQQlr1XrNHlAYpYl2STuACMnU78Ai-BPjiuVg",
    processingTime: "5–10 business days",
    fee: "$150",
    feeUSD: 150,
    validity: "Up to 6 months",
    visaTypes: ["tourist", "business", "student", "work"],
    popular: true,
  },
  {
    id: "schengen",
    countryCode: "DE",
    name: "Schengen Area (Europe)",
    flag: "🇪🇺",
    subtitle: "Short-Stay Visa — 26 European Countries",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZRZiX9Id_TakubrgI7F4G90XQIulJHai72DrL_qRYiHRgPch5jWjQmcw1JWnNKUihwfRTaDuq-yzk1mbZgsby8Vp-O3BeTH1AKnjCZmfyJ1pRO-KsbfUyiJMz0v_PpPxPNn_yJ_C3zD6CC6FYra2DmKXK7jSr7gu3looUfHWcOhSrhkoJcDDB11gcj_Rtv3Ovt4CA-Z5tGxWkl056yZBdZNocR1cyqc1uI86oGuRb1ztrc_epf_SATmf89CfC-IstAS49Wi-Bcz4",
    processingTime: "5–15 business days",
    fee: "$90",
    feeUSD: 90,
    validity: "Up to 90 days within 180-day period",
    visaTypes: ["tourist", "business", "transit"],
    popular: true,
  },
  {
    id: "usa",
    countryCode: "US",
    name: "United States",
    flag: "🇺🇸",
    subtitle: "B1/B2 Visitor, F1 Student & Work Visas",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2muXSASaCtxjQ9vspnQcQuHYbO9cK2A_LSC6skg-53drf5CDmGjbblGjavkjQDC4L1y3kM119sWICru8Y6S4e_nuePl_eW41DT2TTvwv0KoIXEaTNHlLIbB0eAnKkhN9aELWlTrBd1oKfHEo_WMRTnGimzrxTuJASeFYK9WRP5DTBckysXYI8zhECcN7gsyM_GV3Ludi2oXuEL1eOgvP9jCxtDaVDsU7REZoi6WdjExg2nl6uu5uItubD5lEnF-BJUkcMDMbcpS0",
    processingTime: "7–30 business days",
    fee: "$185",
    feeUSD: 185,
    validity: "Up to 10 years (multiple-entry)",
    visaTypes: ["tourist", "business", "student", "work"],
    popular: true,
  },
  {
    id: "japan",
    countryCode: "JP",
    name: "Japan",
    flag: "🇯🇵",
    subtitle: "Single & Multiple Entry Tourist Visas",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq_YAuQ57YyhqSqLckh7KI7ydRovhJJdHs8B0mNWUkgvrqhX1Y7-1RdB8-eRGAQT3B57vc2KxVyQaoBiNeQUOU655XTU_TPE9d6RdQsxT_vSGOCg7VbeBY7zXQlNhYRJSLdRSikzE6AqzDETmtY1elZxj24NRlRys8xTEC_KHKUyoJZ9JLTB00jFGM8hWUaTWiX7Ew6BV-F9S-JBvYoSMYn_CE9V1Cfu2Y1AepmCAgegg_twEnbhi4Y7plOYdWJmnjHszn9Q1id6k",
    processingTime: "3–5 business days",
    fee: "$30",
    feeUSD: 30,
    validity: "15 days / 30 days",
    visaTypes: ["tourist", "business", "student"],
    popular: true,
  },
  {
    id: "australia",
    countryCode: "AU",
    name: "Australia",
    flag: "🇦🇺",
    subtitle: "eVisitor, Visitor & Student Visas",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHLCcra86FJEIsIzLopb5GlIdxhtCWwGC4rsKoR3a4xujTJE4AmbQ8OyMhZyGIi64T9rWb2qIeQhbn0yBpBChECVrWQDVC1wHu61PZ-62jUVEEvt5e0Y6pyxrzyeTebm5o6IGvvDvYNecmzpNJ1vPWTMImpsMc58jNsMgQ3eiHOfyIqWOHpa-OAYyiT_SsqRKefTEuvj9nAKbohZmkNhoP6ZmzK3iznMgxWDy5uQQlr1XrNHlAYpYl2STuACMnU78Ai-BPjiuVg",
    processingTime: "3–15 business days",
    fee: "$145",
    feeUSD: 145,
    validity: "Up to 12 months",
    visaTypes: ["tourist", "business", "student", "work"],
    popular: false,
  },
  {
    id: "egypt",
    countryCode: "EG",
    name: "Egypt",
    flag: "🇪🇬",
    subtitle: "e-Visa & On-Arrival Tourist Visas",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZRZiX9Id_TakubrgI7F4G90XQIulJHai72DrL_qRYiHRgPch5jWjQmcw1JWnNKUihwfRTaDuq-yzk1mbZgsby8Vp-O3BeTH1AKnjCZmfyJ1pRO-KsbfUyiJMz0v_PpPxPNn_yJ_C3zD6CC6FYra2DmKXK7jSr7gu3looUfHWcOhSrhkoJcDDB11gcj_Rtv3Ovt4CA-Z5tGxWkl056yZBdZNocR1cyqc1uI86oGuRb1ztrc_epf_SATmf89CfC-IstAS49Wi-Bcz4",
    processingTime: "1–2 business days",
    fee: "$25",
    feeUSD: 25,
    validity: "30 days",
    visaTypes: ["tourist", "business"],
    popular: false,
  },
];

// ── Navigation ─────────────────────────────────────────────────────────────────

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Flights", href: "/flights", icon: "flight" },
  { label: "Hotels", href: "/hotels", icon: "apartment" },
  { label: "Packages", href: "/packages", icon: "history_edu" },
  { label: "Visa", href: "/visa", icon: "description" },
  { label: "Services", href: "/services", icon: "business_center" },
];

export const adminNavItems: NavItem[] = [
  { label: "Overview", href: "/admin", icon: "dashboard" },
  { label: "Hotel Bookings", href: "/admin/bookings/hotels", icon: "hotel" },
  { label: "Flight Requests", href: "/admin/bookings/flights", icon: "flight" },
  { label: "Package Inventory", href: "/admin/packages", icon: "inventory_2" },
  { label: "User Management", href: "/admin/users", icon: "group" },
  { label: "Visa Applications", href: "/admin/visa", icon: "badge" },
  { label: "Visa Requirements DB", href: "/admin/visa/requirements", icon: "public" },
  { label: "Payments & Analytics", href: "/admin/payments", icon: "bar_chart" },
  { label: "Support Center", href: "/admin/support", icon: "support_agent" },
  { label: "Campaigns & Alerts", href: "/admin/campaigns", icon: "campaign" },
  { label: "System Settings", href: "/admin/settings", icon: "settings" },
];

// ── Platform stats ────────────────────────────────────────────────────────────

export const stats: Stat[] = [
  { label: "Happy Travelers", value: "80,000+", icon: "people" },
  { label: "Destinations Served", value: "195+", icon: "public" },
  { label: "Visa Success Rate", value: "99.2%", icon: "verified" },
  { label: "Years of Excellence", value: "15+", icon: "workspace_premium" },
];

// ── Testimonials ──────────────────────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Al-Mansouri",
    role: "Business Traveler",
    country: "UAE",
    countryCode: "AE",
    content: "Cairo Hangzhou arranged my entire Asia roadshow — Japan, Singapore, and South Korea — flawlessly. The visa coordination alone saved me weeks of paperwork. Exceptional service.",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiKDuO4phPncXjFaiy-1qkt0vLteB6p4ixawGGgtlDhG6FAL5VhkMaPnOLujoBHsahPGxqTl7mxG_d3_kY-PVm_f9ctC1_jSPx08aRLGNyrCgFF6GC8Eit71EcgzcgJ0pxefyX6ZYUxGLuITg_5RHMB6291W4y7QFR3A-48TouLyHur0M_fa3SZ93lhNACX9LN0R_594t1VoWBsrJIDdWQ0pT2ZCSwJQwFSO4_sz8kdOAR-CkgAorQ6jc9PboYJFsq67N6K6qhEl0",
  },
  {
    name: "James Whitmore",
    role: "Leisure Traveler",
    country: "UK",
    countryCode: "GB",
    content: "The Mediterranean Odyssey package was pure magic — from the Acropolis to the Colosseum to the Sagrada Família, every detail was perfect. Five stars doesn't do it justice.",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiKDuO4phPncXjFaiy-1qkt0vLteB6p4ixawGGgtlDhG6FAL5VhkMaPnOLujoBHsahPGxqTl7mxG_d3_kY-PVm_f9ctC1_jSPx08aRLGNyrCgFF6GC8Eit71EcgzcgJ0pxefyX6ZYUxGLuITg_5RHMB6291W4y7QFR3A-48TouLyHur0M_fa3SZ93lhNACX9LN0R_594t1VoWBsrJIDdWQ0pT2ZCSwJQwFSO4_sz8kdOAR-CkgAorQ6jc9PboYJFsq67N6K6qhEl0",
  },
  {
    name: "Dr. Fatima Al-Rashid",
    role: "Medical Professional",
    country: "Saudi Arabia",
    countryCode: "SA",
    content: "My US work visa was handled with extraordinary professionalism — approved in record time. Their global network and expertise is second to none. Highly recommend.",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiKDuO4phPncXjFaiy-1qkt0vLteB6p4ixawGGgtlDhG6FAL5VhkMaPnOLujoBHsahPGxqTl7mxG_d3_kY-PVm_f9ctC1_jSPx08aRLGNyrCgFF6GC8Eit71EcgzcgJ0pxefyX6ZYUxGLuITg_5RHMB6291W4y7QFR3A-48TouLyHur0M_fa3SZ93lhNACX9LN0R_594t1VoWBsrJIDdWQ0pT2ZCSwJQwFSO4_sz8kdOAR-CkgAorQ6jc9PboYJFsq67N6K6qhEl0",
  },
];

// ── Homepage shortcuts ─────────────────────────────────────────────────────────

export const homeShortcuts = [
  { label: "Flights", sub: "Worldwide", icon: "flight", href: "/flights" },
  { label: "Visa", sub: "195+ Countries", icon: "description", href: "/visa" },
  { label: "Packages", sub: "Global Tours", icon: "history_edu", href: "/packages" },
  { label: "Hotels", sub: "Luxury Stays", icon: "apartment", href: "/hotels" },
];
