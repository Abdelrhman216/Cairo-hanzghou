import { getDbItem } from "./db";

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
  price: number;
  image: string;
  amenities: string[];
  description: string;
  category: string;
}

function localizeHotel(hotel: Hotel, lang = "en"): Hotel {
  if (lang === "en" || !lang) return hotel;

  let description = hotel.description;
  let location = hotel.location;
  let category = hotel.category;

  if (hotel.id === "four-seasons-cairo") {
    location = "القاهرة، مصر";
    description = "يطل على نهر النيل المهيب مع إطلالات لا مثيل لها على أهرامات الجيزة.";
    category = "فخامة فائقة";
  } else if (hotel.id === "ritz-carlton-hangzhou") {
    location = "هانغتشو، الصين";
    description = "يقع فوق البحيرة الغربية مع إطلالات بانورامية وضيافة صينية ذات مستوى عالمي.";
    category = "فخامة فائقة";
  } else if (hotel.id === "burj-al-arab") {
    location = "دبي، الإمارات";
    description = "أيقونة الفخامة المصممة على شكل شراع ترتفع من جزيرة خاصة في الخليج العربي.";
    category = "فخامة فائقة";
  } else if (hotel.id === "park-hyatt-tokyo") {
    location = "شينجوكو، اليابان";
    description = "إطلالات دراماتيكية على المدينة من 39 طابقاً فوق شينجوكو — الملاذ الحضري الشهير.";
    category = "فخامة حضرية";
  } else if (hotel.id === "four-seasons-paris") {
    location = "باريس، فرنسا";
    description = "قصر آرت ديكو خالد على بعد خطوات من الشانزليزيه، يشتهر بالفنون والأناقة الباريسية.";
    category = "تراث فاخر";
  } else if (hotel.id === "waldorf-new-york") {
    location = "نيويورك، الولايات المتحدة";
    description = "أيقونة آرت ديكو ترتفع فوق مانهاتن — التاريخ والأناقة والجاه في كل ركن.";
    category = "تراث فاخر";
  }

  return {
    ...hotel,
    location,
    description,
    category,
  };
}

export async function getHotels(lang = "en") {
  const hotels = getDbItem<Hotel[]>("hotels");
  return hotels.map((h) => localizeHotel(h, lang));
}
