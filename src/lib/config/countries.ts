/**
 * Global Countries Configuration
 * Single source of truth for all country-related data.
 * To add a new country: append an entry to this array.
 * No code changes needed elsewhere.
 */

export interface Country {
  code: string;        // ISO 3166-1 alpha-2
  name: string;
  nativeName?: string;
  flag: string;        // emoji flag
  phoneCode: string;   // e.g. "+20"
  currency: {
    code: string;      // ISO 4217
    symbol: string;
    name: string;
  };
  timezone: string;    // IANA tz string (primary)
  continent: Continent;
  languages: string[]; // ISO 639-1 codes
  popular?: boolean;   // shown prominently in dropdowns
  visaOnArrival?: boolean;
  region?: string;     // sub-region label
}

export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Oceania"
  | "Antarctica";

export const COUNTRIES: Country[] = [
  // ─── Africa ───────────────────────────────────────────────────────────────
  { code: "EG", name: "Egypt", nativeName: "مصر", flag: "🇪🇬", phoneCode: "+20", currency: { code: "EGP", symbol: "£", name: "Egyptian Pound" }, timezone: "Africa/Cairo", continent: "Africa", languages: ["ar"], popular: true },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", phoneCode: "+27", currency: { code: "ZAR", symbol: "R", name: "South African Rand" }, timezone: "Africa/Johannesburg", continent: "Africa", languages: ["en", "af", "zu"] },
  { code: "MA", name: "Morocco", nativeName: "المغرب", flag: "🇲🇦", phoneCode: "+212", currency: { code: "MAD", symbol: "MAD", name: "Moroccan Dirham" }, timezone: "Africa/Casablanca", continent: "Africa", languages: ["ar", "fr"] },
  { code: "TN", name: "Tunisia", flag: "🇹🇳", phoneCode: "+216", currency: { code: "TND", symbol: "TND", name: "Tunisian Dinar" }, timezone: "Africa/Tunis", continent: "Africa", languages: ["ar", "fr"] },
  { code: "DZ", name: "Algeria", flag: "🇩🇿", phoneCode: "+213", currency: { code: "DZD", symbol: "DA", name: "Algerian Dinar" }, timezone: "Africa/Algiers", continent: "Africa", languages: ["ar", "fr"] },
  { code: "KE", name: "Kenya", flag: "🇰🇪", phoneCode: "+254", currency: { code: "KES", symbol: "KSh", name: "Kenyan Shilling" }, timezone: "Africa/Nairobi", continent: "Africa", languages: ["en", "sw"] },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", phoneCode: "+234", currency: { code: "NGN", symbol: "₦", name: "Nigerian Naira" }, timezone: "Africa/Lagos", continent: "Africa", languages: ["en"] },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", phoneCode: "+251", currency: { code: "ETB", symbol: "Br", name: "Ethiopian Birr" }, timezone: "Africa/Addis_Ababa", continent: "Africa", languages: ["am"] },
  { code: "GH", name: "Ghana", flag: "🇬🇭", phoneCode: "+233", currency: { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" }, timezone: "Africa/Accra", continent: "Africa", languages: ["en"] },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", phoneCode: "+255", currency: { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" }, timezone: "Africa/Dar_es_Salaam", continent: "Africa", languages: ["sw", "en"] },

  // ─── Asia ──────────────────────────────────────────────────────────────────
  { code: "CN", name: "China", nativeName: "中国", flag: "🇨🇳", phoneCode: "+86", currency: { code: "CNY", symbol: "¥", name: "Chinese Yuan" }, timezone: "Asia/Shanghai", continent: "Asia", languages: ["zh"], popular: true },
  { code: "JP", name: "Japan", nativeName: "日本", flag: "🇯🇵", phoneCode: "+81", currency: { code: "JPY", symbol: "¥", name: "Japanese Yen" }, timezone: "Asia/Tokyo", continent: "Asia", languages: ["ja"], popular: true },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", phoneCode: "+971", currency: { code: "AED", symbol: "د.إ", name: "UAE Dirham" }, timezone: "Asia/Dubai", continent: "Asia", languages: ["ar"], popular: true },
  { code: "SA", name: "Saudi Arabia", nativeName: "المملكة العربية السعودية", flag: "🇸🇦", phoneCode: "+966", currency: { code: "SAR", symbol: "﷼", name: "Saudi Riyal" }, timezone: "Asia/Riyadh", continent: "Asia", languages: ["ar"], popular: true },
  { code: "TR", name: "Turkey", flag: "🇹🇷", phoneCode: "+90", currency: { code: "TRY", symbol: "₺", name: "Turkish Lira" }, timezone: "Europe/Istanbul", continent: "Asia", languages: ["tr"], popular: true },
  { code: "TH", name: "Thailand", flag: "🇹🇭", phoneCode: "+66", currency: { code: "THB", symbol: "฿", name: "Thai Baht" }, timezone: "Asia/Bangkok", continent: "Asia", languages: ["th"], popular: true },
  { code: "IN", name: "India", flag: "🇮🇳", phoneCode: "+91", currency: { code: "INR", symbol: "₹", name: "Indian Rupee" }, timezone: "Asia/Kolkata", continent: "Asia", languages: ["hi", "en"] },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", phoneCode: "+62", currency: { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" }, timezone: "Asia/Jakarta", continent: "Asia", languages: ["id"] },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", phoneCode: "+60", currency: { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" }, timezone: "Asia/Kuala_Lumpur", continent: "Asia", languages: ["ms", "en"] },
  { code: "SG", name: "Singapore", flag: "🇸🇬", phoneCode: "+65", currency: { code: "SGD", symbol: "S$", name: "Singapore Dollar" }, timezone: "Asia/Singapore", continent: "Asia", languages: ["en", "zh", "ms", "ta"] },
  { code: "KR", name: "South Korea", nativeName: "대한민국", flag: "🇰🇷", phoneCode: "+82", currency: { code: "KRW", symbol: "₩", name: "South Korean Won" }, timezone: "Asia/Seoul", continent: "Asia", languages: ["ko"] },
  { code: "QA", name: "Qatar", flag: "🇶🇦", phoneCode: "+974", currency: { code: "QAR", symbol: "﷼", name: "Qatari Riyal" }, timezone: "Asia/Qatar", continent: "Asia", languages: ["ar"] },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", phoneCode: "+965", currency: { code: "KWD", symbol: "KD", name: "Kuwaiti Dinar" }, timezone: "Asia/Kuwait", continent: "Asia", languages: ["ar"] },
  { code: "JO", name: "Jordan", flag: "🇯🇴", phoneCode: "+962", currency: { code: "JOD", symbol: "JD", name: "Jordanian Dinar" }, timezone: "Asia/Amman", continent: "Asia", languages: ["ar"] },
  { code: "LB", name: "Lebanon", flag: "🇱🇧", phoneCode: "+961", currency: { code: "LBP", symbol: "ل.ل", name: "Lebanese Pound" }, timezone: "Asia/Beirut", continent: "Asia", languages: ["ar", "fr"] },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", phoneCode: "+84", currency: { code: "VND", symbol: "₫", name: "Vietnamese Dong" }, timezone: "Asia/Ho_Chi_Minh", continent: "Asia", languages: ["vi"] },
  { code: "PH", name: "Philippines", flag: "🇵🇭", phoneCode: "+63", currency: { code: "PHP", symbol: "₱", name: "Philippine Peso" }, timezone: "Asia/Manila", continent: "Asia", languages: ["en", "fil"] },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", phoneCode: "+92", currency: { code: "PKR", symbol: "₨", name: "Pakistani Rupee" }, timezone: "Asia/Karachi", continent: "Asia", languages: ["ur", "en"] },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", phoneCode: "+880", currency: { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" }, timezone: "Asia/Dhaka", continent: "Asia", languages: ["bn"] },
  { code: "NP", name: "Nepal", flag: "🇳🇵", phoneCode: "+977", currency: { code: "NPR", symbol: "₨", name: "Nepalese Rupee" }, timezone: "Asia/Kathmandu", continent: "Asia", languages: ["ne"] },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", phoneCode: "+94", currency: { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee" }, timezone: "Asia/Colombo", continent: "Asia", languages: ["si", "ta"] },
  { code: "MV", name: "Maldives", flag: "🇲🇻", phoneCode: "+960", currency: { code: "MVR", symbol: "Rf", name: "Maldivian Rufiyaa" }, timezone: "Indian/Maldives", continent: "Asia", languages: ["dv"] },
  { code: "BH", name: "Bahrain", flag: "🇧🇭", phoneCode: "+973", currency: { code: "BHD", symbol: "BD", name: "Bahraini Dinar" }, timezone: "Asia/Bahrain", continent: "Asia", languages: ["ar"] },
  { code: "OM", name: "Oman", flag: "🇴🇲", phoneCode: "+968", currency: { code: "OMR", symbol: "﷼", name: "Omani Rial" }, timezone: "Asia/Muscat", continent: "Asia", languages: ["ar"] },
  { code: "IQ", name: "Iraq", flag: "🇮🇶", phoneCode: "+964", currency: { code: "IQD", symbol: "ع.د", name: "Iraqi Dinar" }, timezone: "Asia/Baghdad", continent: "Asia", languages: ["ar", "ku"] },
  { code: "IL", name: "Israel", flag: "🇮🇱", phoneCode: "+972", currency: { code: "ILS", symbol: "₪", name: "Israeli New Shekel" }, timezone: "Asia/Jerusalem", continent: "Asia", languages: ["he", "ar"] },
  { code: "MM", name: "Myanmar", flag: "🇲🇲", phoneCode: "+95", currency: { code: "MMK", symbol: "K", name: "Myanmar Kyat" }, timezone: "Asia/Rangoon", continent: "Asia", languages: ["my"] },
  { code: "KH", name: "Cambodia", flag: "🇰🇭", phoneCode: "+855", currency: { code: "KHR", symbol: "₭", name: "Cambodian Riel" }, timezone: "Asia/Phnom_Penh", continent: "Asia", languages: ["km"] },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", phoneCode: "+852", currency: { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" }, timezone: "Asia/Hong_Kong", continent: "Asia", languages: ["zh", "en"] },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", phoneCode: "+886", currency: { code: "TWD", symbol: "NT$", name: "New Taiwan Dollar" }, timezone: "Asia/Taipei", continent: "Asia", languages: ["zh"] },

  // ─── Europe ────────────────────────────────────────────────────────────────
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", phoneCode: "+44", currency: { code: "GBP", symbol: "£", name: "British Pound" }, timezone: "Europe/London", continent: "Europe", languages: ["en"], popular: true },
  { code: "FR", name: "France", flag: "🇫🇷", phoneCode: "+33", currency: { code: "EUR", symbol: "€", name: "Euro" }, timezone: "Europe/Paris", continent: "Europe", languages: ["fr"], popular: true },
  { code: "DE", name: "Germany", flag: "🇩🇪", phoneCode: "+49", currency: { code: "EUR", symbol: "€", name: "Euro" }, timezone: "Europe/Berlin", continent: "Europe", languages: ["de"] },
  { code: "IT", name: "Italy", flag: "🇮🇹", phoneCode: "+39", currency: { code: "EUR", symbol: "€", name: "Euro" }, timezone: "Europe/Rome", continent: "Europe", languages: ["it"] },
  { code: "ES", name: "Spain", flag: "🇪🇸", phoneCode: "+34", currency: { code: "EUR", symbol: "€", name: "Euro" }, timezone: "Europe/Madrid", continent: "Europe", languages: ["es"] },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", phoneCode: "+31", currency: { code: "EUR", symbol: "€", name: "Euro" }, timezone: "Europe/Amsterdam", continent: "Europe", languages: ["nl"] },
  { code: "SE", name: "Sweden", flag: "🇸🇪", phoneCode: "+46", currency: { code: "SEK", symbol: "kr", name: "Swedish Krona" }, timezone: "Europe/Stockholm", continent: "Europe", languages: ["sv"] },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", phoneCode: "+41", currency: { code: "CHF", symbol: "Fr", name: "Swiss Franc" }, timezone: "Europe/Zurich", continent: "Europe", languages: ["de", "fr", "it"] },
  { code: "GR", name: "Greece", flag: "🇬🇷", phoneCode: "+30", currency: { code: "EUR", symbol: "€", name: "Euro" }, timezone: "Europe/Athens", continent: "Europe", languages: ["el"] },
  { code: "PT", name: "Portugal", flag: "🇵🇹", phoneCode: "+351", currency: { code: "EUR", symbol: "€", name: "Euro" }, timezone: "Europe/Lisbon", continent: "Europe", languages: ["pt"] },
  { code: "PL", name: "Poland", flag: "🇵🇱", phoneCode: "+48", currency: { code: "PLN", symbol: "zł", name: "Polish Złoty" }, timezone: "Europe/Warsaw", continent: "Europe", languages: ["pl"] },
  { code: "RU", name: "Russia", flag: "🇷🇺", phoneCode: "+7", currency: { code: "RUB", symbol: "₽", name: "Russian Ruble" }, timezone: "Europe/Moscow", continent: "Europe", languages: ["ru"] },
  { code: "NO", name: "Norway", flag: "🇳🇴", phoneCode: "+47", currency: { code: "NOK", symbol: "kr", name: "Norwegian Krone" }, timezone: "Europe/Oslo", continent: "Europe", languages: ["no"] },
  { code: "DK", name: "Denmark", flag: "🇩🇰", phoneCode: "+45", currency: { code: "DKK", symbol: "kr", name: "Danish Krone" }, timezone: "Europe/Copenhagen", continent: "Europe", languages: ["da"] },
  { code: "FI", name: "Finland", flag: "🇫🇮", phoneCode: "+358", currency: { code: "EUR", symbol: "€", name: "Euro" }, timezone: "Europe/Helsinki", continent: "Europe", languages: ["fi", "sv"] },
  { code: "AT", name: "Austria", flag: "🇦🇹", phoneCode: "+43", currency: { code: "EUR", symbol: "€", name: "Euro" }, timezone: "Europe/Vienna", continent: "Europe", languages: ["de"] },
  { code: "BE", name: "Belgium", flag: "🇧🇪", phoneCode: "+32", currency: { code: "EUR", symbol: "€", name: "Euro" }, timezone: "Europe/Brussels", continent: "Europe", languages: ["nl", "fr", "de"] },
  { code: "IE", name: "Ireland", flag: "🇮🇪", phoneCode: "+353", currency: { code: "EUR", symbol: "€", name: "Euro" }, timezone: "Europe/Dublin", continent: "Europe", languages: ["en", "ga"] },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", phoneCode: "+420", currency: { code: "CZK", symbol: "Kč", name: "Czech Koruna" }, timezone: "Europe/Prague", continent: "Europe", languages: ["cs"] },
  { code: "HU", name: "Hungary", flag: "🇭🇺", phoneCode: "+36", currency: { code: "HUF", symbol: "Ft", name: "Hungarian Forint" }, timezone: "Europe/Budapest", continent: "Europe", languages: ["hu"] },
  { code: "RO", name: "Romania", flag: "🇷🇴", phoneCode: "+40", currency: { code: "RON", symbol: "lei", name: "Romanian Leu" }, timezone: "Europe/Bucharest", continent: "Europe", languages: ["ro"] },

  // ─── North America ─────────────────────────────────────────────────────────
  { code: "US", name: "United States", flag: "🇺🇸", phoneCode: "+1", currency: { code: "USD", symbol: "$", name: "US Dollar" }, timezone: "America/New_York", continent: "North America", languages: ["en"], popular: true },
  { code: "CA", name: "Canada", flag: "🇨🇦", phoneCode: "+1", currency: { code: "CAD", symbol: "CA$", name: "Canadian Dollar" }, timezone: "America/Toronto", continent: "North America", languages: ["en", "fr"] },
  { code: "MX", name: "Mexico", flag: "🇲🇽", phoneCode: "+52", currency: { code: "MXN", symbol: "MX$", name: "Mexican Peso" }, timezone: "America/Mexico_City", continent: "North America", languages: ["es"] },
  { code: "CU", name: "Cuba", flag: "🇨🇺", phoneCode: "+53", currency: { code: "CUP", symbol: "₱", name: "Cuban Peso" }, timezone: "America/Havana", continent: "North America", languages: ["es"] },
  { code: "JM", name: "Jamaica", flag: "🇯🇲", phoneCode: "+1-876", currency: { code: "JMD", symbol: "J$", name: "Jamaican Dollar" }, timezone: "America/Jamaica", continent: "North America", languages: ["en"] },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴", phoneCode: "+1-809", currency: { code: "DOP", symbol: "RD$", name: "Dominican Peso" }, timezone: "America/Santo_Domingo", continent: "North America", languages: ["es"] },

  // ─── South America ─────────────────────────────────────────────────────────
  { code: "BR", name: "Brazil", flag: "🇧🇷", phoneCode: "+55", currency: { code: "BRL", symbol: "R$", name: "Brazilian Real" }, timezone: "America/Sao_Paulo", continent: "South America", languages: ["pt"] },
  { code: "AR", name: "Argentina", flag: "🇦🇷", phoneCode: "+54", currency: { code: "ARS", symbol: "$", name: "Argentine Peso" }, timezone: "America/Argentina/Buenos_Aires", continent: "South America", languages: ["es"] },
  { code: "CO", name: "Colombia", flag: "🇨🇴", phoneCode: "+57", currency: { code: "COP", symbol: "$", name: "Colombian Peso" }, timezone: "America/Bogota", continent: "South America", languages: ["es"] },
  { code: "PE", name: "Peru", flag: "🇵🇪", phoneCode: "+51", currency: { code: "PEN", symbol: "S/", name: "Peruvian Sol" }, timezone: "America/Lima", continent: "South America", languages: ["es", "qu"] },
  { code: "CL", name: "Chile", flag: "🇨🇱", phoneCode: "+56", currency: { code: "CLP", symbol: "$", name: "Chilean Peso" }, timezone: "America/Santiago", continent: "South America", languages: ["es"] },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", phoneCode: "+593", currency: { code: "USD", symbol: "$", name: "US Dollar" }, timezone: "America/Guayaquil", continent: "South America", languages: ["es"] },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", phoneCode: "+58", currency: { code: "VES", symbol: "Bs.S", name: "Venezuelan Bolívar" }, timezone: "America/Caracas", continent: "South America", languages: ["es"] },

  // ─── Oceania ───────────────────────────────────────────────────────────────
  { code: "AU", name: "Australia", flag: "🇦🇺", phoneCode: "+61", currency: { code: "AUD", symbol: "A$", name: "Australian Dollar" }, timezone: "Australia/Sydney", continent: "Oceania", languages: ["en"], popular: true },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", phoneCode: "+64", currency: { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" }, timezone: "Pacific/Auckland", continent: "Oceania", languages: ["en", "mi"] },
  { code: "FJ", name: "Fiji", flag: "🇫🇯", phoneCode: "+679", currency: { code: "FJD", symbol: "FJ$", name: "Fijian Dollar" }, timezone: "Pacific/Fiji", continent: "Oceania", languages: ["en", "fj", "hi"] },
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

/** Get country by ISO code */
export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

/** Get all countries sorted alphabetically */
export function getAllCountries(): Country[] {
  return [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
}

/** Get popular countries first, then rest alphabetically */
export function getCountriesWithPopularFirst(): Country[] {
  const popular = COUNTRIES.filter((c) => c.popular).sort((a, b) => a.name.localeCompare(b.name));
  const rest = COUNTRIES.filter((c) => !c.popular).sort((a, b) => a.name.localeCompare(b.name));
  return [...popular, ...rest];
}

/** Group countries by continent */
export function getCountriesByContinent(): Record<Continent, Country[]> {
  return COUNTRIES.reduce(
    (acc, country) => {
      const key = country.continent as Continent;
      if (!acc[key]) acc[key] = [];
      acc[key].push(country);
      return acc;
    },
    {} as Record<Continent, Country[]>
  );
}

/** For phone-code dropdowns */
export function getPhoneCodes(): { code: string; name: string; phoneCode: string; flag: string }[] {
  return getAllCountries().map(({ code, name, phoneCode, flag }) => ({ code, name, phoneCode, flag }));
}

/** For currency dropdowns */
export function getUniqueCurrencies() {
  const seen = new Set<string>();
  return COUNTRIES.reduce<{ code: string; symbol: string; name: string }[]>((acc, c) => {
    if (!seen.has(c.currency.code)) {
      seen.add(c.currency.code);
      acc.push(c.currency);
    }
    return acc;
  }, []).sort((a, b) => a.code.localeCompare(b.code));
}
