import { getDbItem, setDbItem } from "./db";
import { DOCUMENT_REGISTRY } from "@/lib/visa-database";

export interface VisaApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  countryCode: string;
  visaTypeId: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  submissionDate: string;
  assignedTo?: string;
  assignedName?: string;
  notes: { author: string; text: string; date: string }[];
  documents: Record<string, { name: string; url: string; uploadedAt: string }>;
}

const countryTranslations: Record<string, string> = {
  CN: "الصين",
  AE: "الإمارات العربية المتحدة",
  GB: "المملكة المتحدة",
  DE: "منطقة الشنغن (أوروبا)",
  US: "الولايات المتحدة",
  JP: "اليابان",
  AU: "أستراليا",
  EG: "مصر",
};

export async function getVisaCountries(
  continent?: string | null,
  search?: string | null,
  eVisaOnly?: boolean,
  lang = "en"
) {
  const registry = getDbItem<any[]>("visaRequirementsRegistry");

  let result = registry.map((c) => {
    const countryName = lang === "ar" ? countryTranslations[c.countryCode] || c.countryName : c.countryName;
    return {
      countryCode: c.countryCode,
      countryName,
      flag: c.flag,
      continent: c.continent,
      embassyUrl: c.embassyUrl ?? "",
      visaFreeForEgyptian: c.visaFreeForEgyptian ?? false,
      visaTypeCount: c.visaTypes.length,
      visaTypeIds: c.visaTypes.map((v: any) => v.id),
      eVisa: c.visaTypes.some((v: any) => v.eVisa),
      visaOnArrival: c.visaTypes.some((v: any) => v.visaOnArrival),
      processingTime: c.visaTypes[0]?.processingTime ?? "Varies",
    };
  });

  if (continent && continent !== "All") {
    result = result.filter((c) => c.continent === continent);
  }

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.countryName.toLowerCase().includes(s) ||
        c.countryCode.toLowerCase().includes(s)
    );
  }

  if (eVisaOnly) {
    result = result.filter((c) => c.eVisa);
  }

  return { countries: result };
}

export async function getVisaRequirements(
  countryCode: string,
  visaTypeId?: string | null,
  lang = "en"
) {
  const registry = getDbItem<any[]>("visaRequirementsRegistry");
  const country = registry.find((c) => c.countryCode === countryCode);

  if (!country) {
    throw new Error(`Country not found: ${countryCode}`);
  }

  const countryName = lang === "ar" ? countryTranslations[countryCode] || country.countryName : country.countryName;

  if (!visaTypeId) {
    const types = country.visaTypes.map((vt: any) => {
      let label = vt.label;
      let description = vt.description;
      if (lang === "ar") {
        if (vt.id === "tourist") {
          label = "تأشيرة سياحية";
          description = "للسياحة وقضاء العطلات وزيارة الأصدقاء أو العائلة.";
        } else if (vt.id === "business") {
          label = "تأشيرة رجال أعمال";
          description = "للاجتماعات والمؤتمرات والمعارض التجارية والأعمال التجارية قصيرة الأجل.";
        } else if (vt.id === "student") {
          label = "تأشيرة دراسة";
          description = "للدراسة في مؤسسة تعليمية معتمدة.";
        } else if (vt.id === "work") {
          label = "تأشيرة عمل";
          description = "للعمل المؤقت أو طويل الأجل.";
        }
      }
      return {
        id: vt.id,
        label,
        description,
        icon: vt.icon || "description",
        processingTime: vt.processingTime,
        governmentFee: vt.governmentFee || "Varies",
        maxStay: vt.maxStay || "Varies",
        validity: vt.validity || "Varies",
        eVisa: vt.eVisa ?? false,
        visaOnArrival: vt.visaOnArrival ?? false,
        documentCount: vt.requiredDocuments?.length ?? 0,
        requiredDocumentCount: vt.requiredDocuments?.filter((d: any) => d.required).length ?? 0,
      };
    });

    return {
      countryCode: country.countryCode,
      countryName,
      flag: country.flag,
      embassyUrl: country.embassyUrl ?? "",
      visaTypes: types,
    };
  }

  const vt = country.visaTypes.find((t: any) => t.id === visaTypeId);
  if (!vt) {
    throw new Error(`Visa type '${visaTypeId}' not found for ${countryCode}`);
  }

  let vtLabel = vt.label;
  let vtDesc = vt.description;
  if (lang === "ar") {
    if (vt.id === "tourist") {
      vtLabel = "تأشيرة سياحية";
      vtDesc = "للسياحة وقضاء العطلات وزيارة الأصدقاء أو العائلة.";
    } else if (vt.id === "business") {
      vtLabel = "تأشيرة رجال أعمال";
      vtDesc = "للاجتماعات والمؤتمرات والمعارض التجارية والأعمال التجارية قصيرة الأجل.";
    }
  }

  // Map and translate documents
  const docs = (vt.requiredDocuments ?? []).map((d: any) => {
    let label = d.label;
    let description = d.description;

    if (lang === "ar") {
      if (d.id === "passport") {
        label = "جواز سفر ساري المفعول";
        description = "جواز السفر الأصلي مع صلاحية لا تقل عن 6 أشهر بعد تواريخ السفر وصفحتين فارغتين.";
      } else if (d.id === "photo") {
        label = "صورة شخصية لخلفية بيضاء";
        description = "صورة شخصية حديثة مقاس 3.5 × 4.5 سم بخلفية بيضاء سادة، تم التقاطها خلال 6 أشهر.";
      } else if (d.id === "bank_statement") {
        label = "كشف حساب بنكي (3-6 أشهر)";
        description = "كشف حساب بنكي أصلي لآخر 3 إلى 6 أشهر يوضح وجود أموال كافية للرحلة.";
      } else if (d.id === "hotel_reservation") {
        label = "حجز فندق مؤكد";
        description = "تأكيد حجز الفندق أو إثبات الإقامة طوال فترة الإقامة.";
      } else if (d.id === "flight_itinerary") {
        label = "حجز طيران مبدئي";
        description = "تأكيد حجز تذكرة الطيران ذهاباً وإياباً أو متعدد المدن.";
      }
    }

    return {
      ...d,
      label,
      description,
    };
  });

  return {
    countryCode: country.countryCode,
    countryName,
    flag: country.flag,
    visaType: {
      id: vt.id,
      label: vtLabel,
      description: vtDesc,
      icon: vt.icon || "description",
      processingTime: vt.processingTime,
      governmentFee: vt.governmentFee || "Varies",
      maxStay: vt.maxStay || "Varies",
      validity: vt.validity || "Varies",
      eVisa: vt.eVisa ?? false,
      visaOnArrival: vt.visaOnArrival ?? false,
    },
    requiredDocuments: docs,
  };
}

export async function uploadVisaDocument(file: File) {
  // Simulate mock file upload
  return {
    success: true,
    url: "#",
    name: file.name,
    uploadedAt: new Date().toISOString(),
  };
}

export async function submitVisaApplication(data: {
  countryCode: string;
  visaTypeId: string;
  documents: Record<string, { name: string; url: string; uploadedAt: string }>;
}) {
  const currentUser = getDbItem<any>("currentUser");
  const applications = getDbItem<VisaApplication[]>("visaApplications");

  const newApp: VisaApplication = {
    id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: currentUser?.id ?? "USR-GUEST",
    userName: currentUser?.name ?? "Guest User",
    userEmail: currentUser?.email ?? "guest@example.com",
    countryCode: data.countryCode,
    visaTypeId: data.visaTypeId,
    status: "pending",
    submissionDate: new Date().toISOString().split("T")[0],
    notes: [],
    documents: data.documents,
  };

  applications.push(newApp);
  setDbItem<VisaApplication[]>("visaApplications", applications);

  return {
    success: true,
    applicationId: newApp.id,
  };
}

export async function getVisaApplications() {
  return getDbItem<VisaApplication[]>("visaApplications");
}

export async function getVisaApplication(id: string) {
  const applications = getDbItem<VisaApplication[]>("visaApplications");
  const app = applications.find((a) => a.id === id);
  return app || null;
}

export async function updateVisaApplicationStatus(id: string, status: "pending" | "reviewing" | "approved" | "rejected") {
  const applications = getDbItem<VisaApplication[]>("visaApplications");
  const updated = applications.map((a) => (a.id === id ? { ...a, status } : a));
  setDbItem<VisaApplication[]>("visaApplications", updated);
  return { success: true };
}

export async function assignVisaApplication(id: string, employeeId: string) {
  const applications = getDbItem<VisaApplication[]>("visaApplications");
  const users = getDbItem<any[]>("users");
  const employee = users.find((u) => u.id === employeeId);

  const updated = applications.map((a) =>
    a.id === id
      ? {
          ...a,
          assignedTo: employeeId,
          assignedName: employee ? employee.name : "Unassigned",
        }
      : a
  );
  setDbItem<VisaApplication[]>("visaApplications", updated);
  return { success: true };
}

export async function addVisaApplicationNote(id: string, text: string, author: string) {
  const applications = getDbItem<VisaApplication[]>("visaApplications");
  const updated = applications.map((a) =>
    a.id === id
      ? {
          ...a,
          notes: [...a.notes, { author, text, date: new Date().toISOString().split("T")[0] }],
        }
      : a
  );
  setDbItem<VisaApplication[]>("visaApplications", updated);
  return { success: true };
}

// Requirement Management (Admin settings)
export async function getDocumentRegistry() {
  return Object.values(DOCUMENT_REGISTRY);
}

export async function addVisaRequirement(countryCode: string, visaTypeId: string, document: any) {
  const registry = getDbItem<any[]>("visaRequirementsRegistry");
  const updated = registry.map((country) => {
    if (country.countryCode !== countryCode) return country;

    const visaTypes = country.visaTypes.map((vt: any) => {
      if (vt.id !== visaTypeId) return vt;
      
      const reqDocs = vt.requiredDocuments || [];
      if (reqDocs.some((d: any) => d.id === document.id)) return vt;
      
      return {
        ...vt,
        requiredDocuments: [...reqDocs, document],
      };
    });

    return {
      ...country,
      visaTypes,
    };
  });

  setDbItem<any[]>("visaRequirementsRegistry", updated);
  return document;
}

export async function updateVisaRequirement(countryCode: string, visaTypeId: string, docId: string, patch: any) {
  const registry = getDbItem<any[]>("visaRequirementsRegistry");
  let updatedDoc: any = null;

  const updated = registry.map((country) => {
    if (country.countryCode !== countryCode) return country;

    const visaTypes = country.visaTypes.map((vt: any) => {
      if (vt.id !== visaTypeId) return vt;

      const requiredDocuments = vt.requiredDocuments.map((d: any) => {
        if (d.id !== docId) return d;
        updatedDoc = { ...d, ...patch };
        return updatedDoc;
      });

      return {
        ...vt,
        requiredDocuments,
      };
    });

    return {
      ...country,
      visaTypes,
    };
  });

  setDbItem<any[]>("visaRequirementsRegistry", updated);
  return updatedDoc;
}

export async function deleteVisaRequirement(countryCode: string, visaTypeId: string, docId: string) {
  const registry = getDbItem<any[]>("visaRequirementsRegistry");
  const updated = registry.map((country) => {
    if (country.countryCode !== countryCode) return country;

    const visaTypes = country.visaTypes.map((vt: any) => {
      if (vt.id !== visaTypeId) return vt;

      const requiredDocuments = vt.requiredDocuments.filter((d: any) => d.id !== docId);
      return {
        ...vt,
        requiredDocuments,
      };
    });

    return {
      ...country,
      visaTypes,
    };
  });

  setDbItem<any[]>("visaRequirementsRegistry", updated);
  return true;
}
