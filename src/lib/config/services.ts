/**
 * Global Services Configuration
 * All business service categories Cairo Hangzhou offers worldwide.
 * Adding a new service only requires appending here.
 */

export interface ServiceCategory {
  id: string;
  label: string;
  description: string;
  icon: string; // Material Symbol name
  href: string;
  color?: string; // tailwind bg class for accent
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "flights",
    label: "Flights",
    description: "Premium air travel to any destination worldwide",
    icon: "flight",
    href: "/flights",
  },
  {
    id: "hotels",
    label: "Hotels",
    description: "Curated luxury accommodations globally",
    icon: "apartment",
    href: "/hotels",
  },
  {
    id: "packages",
    label: "Tour Packages",
    description: "Bespoke travel packages for every destination",
    icon: "history_edu",
    href: "/packages",
  },
  {
    id: "visa",
    label: "Visa Services",
    description: "Expert visa consultancy for all countries",
    icon: "description",
    href: "/visa",
  },
  {
    id: "business",
    label: "Business Travel",
    description: "End-to-end corporate travel solutions",
    icon: "business_center",
    href: "/services/business",
  },
  {
    id: "education",
    label: "Education Abroad",
    description: "Student visas, university placement, relocation",
    icon: "school",
    href: "/services/education",
  },
  {
    id: "translation",
    label: "Translation & Legalization",
    description: "Certified document translation and attestation",
    icon: "translate",
    href: "/services/translation",
  },
  {
    id: "logistics",
    label: "Logistics & Shipping",
    description: "International cargo and document courier",
    icon: "local_shipping",
    href: "/services/logistics",
  },
];

/** Visa types offered globally */
export const VISA_TYPES = [
  { id: "tourist", label: "Tourist Visa", icon: "luggage" },
  { id: "business", label: "Business Visa", icon: "business_center" },
  { id: "student", label: "Student Visa", icon: "school" },
  { id: "work", label: "Work Visa / Work Permit", icon: "work" },
  { id: "transit", label: "Transit Visa", icon: "connecting_airports" },
  { id: "family", label: "Family / Spouse Visa", icon: "family_restroom" },
  { id: "residence", label: "Residency / Long-Stay", icon: "home" },
  { id: "medical", label: "Medical Visa", icon: "local_hospital" },
] as const;

export type VisaTypeId = typeof VISA_TYPES[number]["id"];

/** Cabin classes for flights */
export const CABIN_CLASSES = [
  { id: "economy", label: "Economy" },
  { id: "premium_economy", label: "Premium Economy" },
  { id: "business", label: "Business" },
  { id: "first", label: "First Class" },
] as const;

export type CabinClassId = typeof CABIN_CLASSES[number]["id"];

/** Trip types */
export const TRIP_TYPES = [
  { id: "one_way", label: "One Way" },
  { id: "round_trip", label: "Round Trip" },
  { id: "multi_city", label: "Multi-City" },
] as const;

export type TripTypeId = typeof TRIP_TYPES[number]["id"];

/** Hotel star ratings */
export const HOTEL_STARS = [5, 4, 3, 2] as const;

/** Document types required for visa applications */
export const VISA_DOCUMENTS = [
  { id: "passport", icon: "badge", label: "Valid Passport (6+ months validity)" },
  { id: "photo", icon: "photo_camera", label: "Recent Passport Photo (3.5×4.5cm)" },
  { id: "application", icon: "description", label: "Completed Application Form" },
  { id: "flight", icon: "airplane_ticket", label: "Confirmed Flight Booking or Itinerary" },
  { id: "hotel", icon: "hotel", label: "Hotel Reservation or Accommodation Proof" },
  { id: "bank", icon: "account_balance_wallet", label: "Bank Statement (last 3 months)" },
  { id: "insurance", icon: "health_and_safety", label: "Travel Insurance Certificate" },
  { id: "employment", icon: "work", label: "Employment Letter / NOC" },
] as const;

/** Common hotel amenities */
export const HOTEL_AMENITIES = [
  "Free WiFi",
  "Swimming Pool",
  "Spa & Wellness",
  "Fitness Center",
  "Airport Shuttle",
  "Restaurant",
  "Concierge",
  "Business Center",
  "Room Service",
  "Parking",
  "Bar / Lounge",
  "Laundry Service",
] as const;

/** Price range filter options */
export const PRICE_RANGES = {
  flights: [
    { label: "Under $500", min: 0, max: 500 },
    { label: "$500 – $1,500", min: 500, max: 1500 },
    { label: "$1,500 – $3,000", min: 1500, max: 3000 },
    { label: "Above $3,000", min: 3000, max: Infinity },
  ],
  hotels: [
    { label: "Under $100/night", min: 0, max: 100 },
    { label: "$100 – $300/night", min: 100, max: 300 },
    { label: "$300 – $600/night", min: 300, max: 600 },
    { label: "Above $600/night", min: 600, max: Infinity },
  ],
  packages: [
    { label: "Under $1,500", min: 0, max: 1500 },
    { label: "$1,500 – $3,000", min: 1500, max: 3000 },
    { label: "$3,000 – $6,000", min: 3000, max: 6000 },
    { label: "Above $6,000", min: 6000, max: Infinity },
  ],
};
