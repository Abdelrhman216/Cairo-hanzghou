import { getDbItem, setDbItem } from "./db";

export interface TravelPackage {
  id: string;
  title: string;
  subtitle: string;
  destinations: string[];
  destinationLabel: string;
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

function localizePackage(pkg: any, lang = "en") {
  if (lang === "en" || !lang) return pkg;

  let title = pkg.title;
  let subtitle = pkg.subtitle;
  let destinationLabel = pkg.destinationLabel;
  let highlights = pkg.highlights;
  let includes = pkg.includes;
  let tag = pkg.tag;

  // Tag translations
  if (pkg.tag === "Best Seller") tag = "الأكثر مبيعاً";
  else if (pkg.tag === "New") tag = "جديد";
  else if (pkg.tag === "Trending") tag = "شائع الآن";
  else if (pkg.tag === "Premium") tag = "رحلة مميزة";
  else if (pkg.tag === "Popular") tag = "شعبية";
  else if (pkg.tag === "Signature") tag = "توقيعنا الخاص";

  if (pkg.id === "pharaohs-legacy") {
    title = "إرث الفراعنة";
    subtitle = "تجربة مصر الجوهرية";
    destinationLabel = "مصر";
    highlights = ["أهرامات الجيزة الكبرى", "المتحف المصري", "عشاء نيلى عائم", "وادي الملوك", "معبد الأقصر"];
    includes = ["فندق 5 نجوم", "انتقالات خاصة", "مرشد سياحي خبير", "إفطار يومي", "انتقالات المطار"];
  } else if (pkg.id === "silk-road-serenity") {
    title = "هدوء طريق الحرير";
    subtitle = "انغماس ثقافي في هانغتشو وشنغهاي";
    destinationLabel = "الصين";
    highlights = ["جولة مركب في البحيرة الغربية", "مراسم شاي لونغجينغ", "معبد لينغ ين", "متحف الحرير", "مأكولات تقليدية"];
    includes = ["فندق بوتيك", "انتقالات خاصة", "خبير شاي", "وجبات يومية", "انتقالات المطار"];
  } else if (pkg.id === "japan-sakura") {
    title = "ممر ساكورا اليابان";
    subtitle = "طوكيو، كيوتو وأوساكا في موسم الازدهار";
    destinationLabel = "اليابان";
    highlights = ["رحلة يومية لجبل فوجي", "ضريح فوشيمي إيناري", "سوق نيشيكي", "القطار الطلقة (شينكانسن)", "جولة طعام الشارع في أوساكا"];
    includes = ["فنادق ريوكان ومدن", "بطاقة قطارات JR", "مرشد سياحي خبير", "إفطار يومي", "مساعدة في التأشيرة"];
  } else if (pkg.id === "dual-civilization") {
    title = "رحلة الحضارة المزدوجة";
    subtitle = "مصر والصين — عالمان قديمان";
    destinationLabel = "مصر + الصين";
    highlights = ["القاهرة وأهرامات الجيزة", "وادي الملوك بالأقصر", "بحيرة هانغتشو الغربية", "جولة مدينة شنغهاي", "مساعدة تأشيرة البلدين"];
    includes = ["فنادق 5 نجوم", "جميع الانتقالات", "تأشيرة البلدين مشمولة", "وجبات كاملة", "كونسيرج مخصص"];
  } else if (pkg.id === "mediterranean-odyssey") {
    title = "ملحمة البحر الأبيض المتوسط";
    subtitle = "اليونان، إيطاليا وإسبانيا في رحلة واحدة";
    destinationLabel = "اليونان، إيطاليا وإسبانيا";
    highlights = ["غروب شمس سانتوريني", "كولوسيوم روما", "كاتدرائية ساغرادا فاميليا في برشلونة", "طريق ساحل أمالفي", "أكروبوليس أثينا"];
    includes = ["فنادق بوتيك", "رحلات طيران داخل أوروبا", "مرشد سياحي خبير", "إفطار يومي", "مساعدة تأشيرة شنغن"];
  } else if (pkg.id === "nile-luxury-cruise") {
    title = "رحلة نيلية فاخرة";
    subtitle = "الإبحار بين العجائب القديمة";
    destinationLabel = "مصر";
    highlights = ["سفينة كروز 5 نجوم", "معبد كوم أمبو", "معبد إدفو", "السد العالي بأسوان", "القرية النوبية"];
    includes = ["كابينة فاخرة", "جميع الوجبات", "جولات شاطئية", "مرشد مصريات خبير", "انتقالات"];
  }

  return {
    ...pkg,
    title,
    subtitle,
    destinationLabel,
    highlights,
    includes,
    tag,
  };
}

export async function getPackages(lang = "en") {
  const pkgs = getDbItem<TravelPackage[]>("packages");
  return pkgs.map((p) => localizePackage(p, lang));
}

export async function getPackage(id: string, lang = "en") {
  const pkgs = getDbItem<TravelPackage[]>("packages");
  const pkg = pkgs.find((p) => p.id === id);
  if (!pkg) return null;
  return localizePackage(pkg, lang);
}

export async function addPackage(pkg: TravelPackage) {
  const pkgs = getDbItem<TravelPackage[]>("packages");
  pkgs.push(pkg);
  setDbItem<TravelPackage[]>("packages", pkgs);
  return { success: true };
}

export async function deletePackage(id: string) {
  const pkgs = getDbItem<TravelPackage[]>("packages");
  const filtered = pkgs.filter((p) => p.id !== id);
  setDbItem<TravelPackage[]>("packages", filtered);
  return { success: true };
}

export async function updateCmsPackage(id: string, patch: any) {
  const pkgs = getDbItem<TravelPackage[]>("packages");
  const updated = pkgs.map((p) => (p.id === id ? { ...p, ...patch } : p));
  setDbItem<TravelPackage[]>("packages", updated);
  return { success: true };
}
