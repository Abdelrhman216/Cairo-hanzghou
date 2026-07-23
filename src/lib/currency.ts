/**
 * Egyptian Pound (EGP) Currency Formatting Utility
 * Central source of truth for all price display across the website.
 * All prices on the website are displayed in EGP only.
 */

/**
 * Format a number as Egyptian Pounds.
 * @param amount - The amount in EGP
 * @param locale - "en" for English format, "ar" for Arabic format
 * @returns Formatted string, e.g. "EGP 12,500" or "12,500 ج.م"
 */
export function formatEGP(amount: number, locale: "en" | "ar" = "en"): string {
  const formatted = amount.toLocaleString("en-US");
  if (locale === "ar") {
    return `${formatted} ج.م`;
  }
  return `EGP ${formatted}`;
}

/**
 * Format a price range string in EGP.
 */
export function formatEGPRange(min: number, max: number, locale: "en" | "ar" = "en"): string {
  if (locale === "ar") {
    if (max === Infinity) return `أكثر من ${min.toLocaleString("en-US")} ج.م`;
    if (min === 0) return `أقل من ${max.toLocaleString("en-US")} ج.م`;
    return `${min.toLocaleString("en-US")} - ${max.toLocaleString("en-US")} ج.م`;
  }
  if (max === Infinity) return `Above EGP ${min.toLocaleString("en-US")}`;
  if (min === 0) return `Under EGP ${max.toLocaleString("en-US")}`;
  return `EGP ${min.toLocaleString("en-US")} – EGP ${max.toLocaleString("en-US")}`;
}

/** Currency code constant */
export const CURRENCY_CODE = "EGP";
export const CURRENCY_SYMBOL_AR = "ج.م";
