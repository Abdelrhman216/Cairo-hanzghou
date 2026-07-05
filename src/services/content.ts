import { getDbItem } from "./db";

export async function getHomeContent(lang = "en") {
  const allDestinations = getDbItem<any[]>("destinations");
  const allServices = getDbItem<any[]>("services");
  const stats = getDbItem<any[]>("stats");
  const testimonials = getDbItem<any[]>("testimonials");
  const shortcuts = getDbItem<any[]>("shortcuts");

  // Localized destinations
  const destinations = allDestinations.map((d) => {
    let name = d.name;
    let location = d.location;
    let description = d.description;
    let category = d.category;
    let price = d.price;
    let duration = d.duration;

    if (lang === "ar") {
      price = d.price.replace("From $", "تبدأ من ") + " $";
      duration = d.duration.replace("nights", "ليالي").replace("night", "ليلة");
      
      if (d.id === "giza-necropolis") {
        name = "أهرامات الجيزة";
        location = "الجيزة، مصر";
        category = "حصري";
        description = "شاهد الأثر الوحيد المتبقي من عجائب الدنيا السبع القديمة بعظمة تحبس الأنفاس.";
      } else if (d.id === "west-lake-hangzhou") {
        name = "بحيرة هانغتشو الغربية";
        location = "هانغتشو، الصين";
        category = "طبيعة";
        description = "انغمس في الجمال الهادئ لأجنحة البحيرة الغربية الضبابية وحقول الشاي الأخضر وارف الظلال.";
      } else if (d.id === "santorini-caldera") {
        name = "كالديرا سانتوريني";
        location = "سانتوريني، اليونان";
        category = "فخامة";
        description = "إطلالات القباب الزرقاء الأيقونية وغروب الشمس البركاني الساحر فوق بحر إيجة.";
      } else if (d.id === "kyoto-temples") {
        name = "معابد كيوتو";
        location = "كيوتو، اليابان";
        category = "ثقافة";
        description = "تجول عبر قرون من تاريخ الساموراي، الأجنحة الذهبية، وأشجار الكرز المزهرة.";
      } else if (d.id === "dubai-marina") {
        name = "مرسى دبي";
        location = "دبي، الإمارات";
        category = "عصري";
        description = "مستقبل الفخامة — ناطحات السحاب الشاهقة، أطول الفنادق في العالم، ومغامرات الصحراء.";
      } else if (d.id === "maldives-atoll") {
        name = "فيلات المالديف المائية";
        location = "مالي آتول، المالديف";
        category = "هدوء";
        description = "البحيرات الكريستالية الصافية، الأكواخ المائية الفاخرة، والهدوء المطلق في المحيط الهندي.";
      }
    }

    return { ...d, name, location, description, category, price, duration };
  });

  // Localized services
  const services = allServices.map((s) => {
    let label = s.label;
    let description = s.description;

    if (lang === "ar") {
      if (s.id === "visa") {
        label = "استشارات التأشيرات";
        description = "معاملات احترافية لأكثر من 195 دولة بنسبة قبول 99.2%";
      } else if (s.id === "flights") {
        label = "حجز الطيران";
        description = "رحلات طيران درجة أولى ودرجة رجال الأعمال بأسعار حصرية";
      } else if (s.id === "hotels") {
        label = "الفنادق الفاخرة";
        description = "إقامة في أرقى الفنادق والمنتجعات العالمية مع مزايا خاصة";
      } else if (s.id === "packages") {
        label = "البرامج السياحية";
        description = "رحلات سياحية متكاملة مصممة بعناية لتناسب تطلعاتكم";
      } else if (s.id === "corporate") {
        label = "سفر الشركات";
        description = "إدارة مخصصة لسفر أعمال الشركات والوفود والمؤتمرات";
      } else if (s.id === "concierge") {
        label = "الكونسيرج الخاص";
        description = "دعم ومساعدة على مدار الساعة طوال رحلتكم أينما كنتم";
      } else if (s.id === "charter") {
        label = "الطيران الخاص";
        description = "طائرات خاصة مستأجرة لخصوصية وراحة مطلقة في السفر";
      } else if (s.id === "cargo") {
        label = "الشحن واللوجستيات";
        description = "حلول شحن آمنة وسريعة للمقتنيات الثمينة والأمتعة الإضافية";
      }
    }

    return { ...s, label, description };
  });

  // Settings
  const company = {
    name: "Cairo Hangzhou",
    tagline: lang === "ar" ? "خدمات التأشيرات والسفر الفاخرة" : "Visa & Travel Services",
    email: "info@cairohangzhou.com",
    phone: "+20 123 456 7890",
    website: "https://cairohangzhou.com",
  };

  const settings = {
    heroTitle: lang === "ar" ? "سافر بلا حدود" : "Travel Without Borders",
    heroSubtitle: lang === "ar" ? "خدمات راقية للتأشيرات، الطيران، الفنادق والرحلات السياحية بدعم من خبراء السفر." : "Premium visa, flight, hotel, and tour services backed by expert advisors.",
    heroImage: "/hero.png",
    promiseCards: lang === "ar" ? [
      { id: "approval", icon: "verified", title: "قبول مضمون للتأشيرات", desc: "نسبة نجاح 99.2% عبر أكثر من 195 دولة مع دعم مخصص للأوراق والملفات" },
      { id: "reach", icon: "public", title: "تغطية عالمية حقيقية", desc: "مكاتب وشركاء وخبراء سفر في كافة القارات الرئيسية" },
      { id: "service", icon: "workspace_premium", title: "خدمة راقية مخصصة", desc: "خدمة كونسيرج على مدار الساعة طوال رحلتك في أي مكان في العالم" },
      { id: "insured", icon: "security", title: "موثوق ومؤمن بالكامل", desc: "وكالة سفر مرخصة بالكامل تقدم حماية سفر شاملة لجميع الوجهات" },
    ] : [
      { id: "approval", icon: "verified", title: "Guaranteed Visa Approval", desc: "99.2% success rate across 195+ countries with dedicated document support" },
      { id: "reach", icon: "public", title: "Truly Global Reach", desc: "Offices, partners, and expertise in every major continent" },
      { id: "service", icon: "workspace_premium", title: "White-Glove Service", desc: "24/7 concierge available throughout your journey, anywhere in the world" },
      { id: "insured", icon: "security", title: "Trusted & Insured", desc: "Fully licensed with comprehensive travel protection for all destinations" },
    ],
  };

  return {
    settings,
    company,
    stats,
    testimonials,
    shortcuts,
    services,
    destinations,
  };
}
