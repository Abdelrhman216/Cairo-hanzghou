import { NextResponse } from "next/server";
import { getVisaTypesForCountry, prisma } from "@/lib/server-store";

/**
 * GET /api/visa/countries
 * Returns all countries from the PostgreSQL database.
 * Query params:
 *   continent?: filter by continent name
 *   search?:    filter by country name or code
 *   eVisa?:     "true" — only e-Visa eligible countries
 *   lang?:      language for localized content
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const continent = searchParams.get("continent");
  const search = searchParams.get("search")?.toLowerCase();
  const eVisaOnly = searchParams.get("eVisa") === "true";
  const lang = searchParams.get("lang") || "en";

  const whereClause: any = {};
  if (continent && continent !== "All") {
    whereClause.continent = continent;
  }

  const rawCountries = await prisma.country.findMany({
    where: whereClause,
    include: {
      visaTypes: true,
    },
    orderBy: { countryName: "asc" },
  });

  let result = rawCountries.map((c: any) => ({
    countryCode: c.countryCode,
    countryName: c.countryName,
    flag: c.flag,
    continent: c.continent,
    embassyUrl: c.embassyUrl,
    visaFreeForEgyptian: false,
    visaTypeCount: c.visaTypes.length,
    visaTypeIds: c.visaTypes.map((v: any) => v.id.split("::")[1] || v.id),
    eVisa: c.visaTypes.some((v: any) => v.eVisa),
    visaOnArrival: c.visaTypes.some((v: any) => v.visaOnArrival),
    processingTime: c.visaTypes[0]?.processingTime ?? "Varies",
  }));

  if (search) {
    result = result.filter(
      (c: any) =>
        c.countryName.toLowerCase().includes(search) ||
        c.countryCode.toLowerCase().includes(search)
    );
  }

  if (eVisaOnly) {
    result = result.filter((c: any) => c.eVisa);
  }

  return NextResponse.json({ countries: result });
}
