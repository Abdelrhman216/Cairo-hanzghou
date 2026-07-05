import { getDbItem } from "./db";

export interface FlightRoute {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  class: string;
  price: number;
  seats: number;
}

const cityTranslations: Record<string, string> = {
  "Cairo": "القاهرة",
  "Dubai": "دبي",
  "London": "لندن",
  "New York": "نيويورك",
  "Hangzhou": "هانغتشو",
  "Singapore": "سنغافورة",
  "Sydney": "سيدني",
  "Tokyo": "طوكيو",
  "Paris": "باريس",
};

const classTranslations: Record<string, string> = {
  "Business": "رجال الأعمال",
  "First": "الدرجة الأولى",
  "Economy": "الدرجة السياحية",
};

function localizeFlight(flight: FlightRoute, lang = "en"): FlightRoute {
  if (lang === "en" || !lang) return flight;

  const fromCity = cityTranslations[flight.fromCity] || flight.fromCity;
  const toCity = cityTranslations[flight.toCity] || flight.toCity;
  const from = `${fromCity} (${flight.fromCode})`;
  const to = `${toCity} (${flight.toCode})`;
  const flightClass = classTranslations[flight.class] || flight.class;
  const duration = flight.duration.replace("h", "س").replace("m", "د");

  return {
    ...flight,
    fromCity,
    toCity,
    from,
    to,
    class: flightClass,
    duration,
  };
}

export async function getFlights(lang = "en") {
  const flights = getDbItem<FlightRoute[]>("flights");
  return flights.map((f) => localizeFlight(f, lang));
}
