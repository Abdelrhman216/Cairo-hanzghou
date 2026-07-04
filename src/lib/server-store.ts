import { PrismaClient } from "@prisma/client";
import type {
  CountryVisaProfile,
  VisaType,
  VisaDocument,
} from "./visa-types";
import { DOCUMENT_REGISTRY } from "./visa-database";
// ─── Prisma Global Singleton ──────────────────────────────────────────────────

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter, log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"] });
};

export const prisma =
  globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "Pending"
  | "Under Review"
  | "Documents Required"
  | "Approved"
  | "Rejected"
  | "Completed";

export interface StoredFile {
  fileId: string;
  documentId: string;
  documentLabel: string;
  applicationId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  content: string; // Base-64 encoded
  uploadedAt: string;
}

export interface InternalNote {
  id: string;
  author: string;
  content: string;
  time: string;
}

export interface VisaApplication {
  id: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  visaTypeId: string;
  visaTypeLabel: string;
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality: string;
    passportNumber: string;
    dateOfBirth: string;
    travelDate: string;
    returnDate?: string;
  };
  status: ApplicationStatus;
  assignedTo: string;
  fileIds: string[];
  internalNotes: InternalNote[];
  notes?: string;
  governmentFee?: string;
  processingTime?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface AdminNotification {
  id: string;
  applicationId: string;
  message: string;
  read: boolean;
  time: string;
}

export interface EmailLog {
  id: string;
  applicationId: string;
  to: string;
  subject: string;
  body: string;
  type: "company_notification" | "customer_confirmation" | "status_update";
  sentAt: string;
}

export interface ActivityLog {
  id: string;
  applicationId: string;
  action: string;
  details: string;
  actor: string;
  time: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Permission {
  id: string;
  code: string;
  description: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  status: "active" | "inactive";
  joinedDate: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
}

export interface UserSession {
  token: string;
  userId: string;
  expiresAt: string;
}

// ─── i18n Translation Handlers ────────────────────────────────────────────────

export async function getLanguages() {
  return await prisma.language.findMany();
}

export async function getLocalizedValue(
  entityType: string,
  entityId: string,
  fieldName: string,
  lang: string,
  defaultValue: string
): Promise<string> {
  if (!lang || lang === "en") return defaultValue;
  try {
    const loc = await prisma.localizedContent.findUnique({
      where: {
        entityType_entityId_fieldName_locale: {
          entityType,
          entityId,
          fieldName,
          locale: lang,
        },
      },
    });
    return loc ? loc.content : defaultValue;
  } catch {
    return defaultValue;
  }
}

export async function getLocalizedArray(
  entityType: string,
  entityId: string,
  fieldName: string,
  lang: string,
  defaultValue: string[]
): Promise<string[]> {
  if (!lang || lang === "en") return defaultValue;
  try {
    const loc = await prisma.localizedContent.findUnique({
      where: {
        entityType_entityId_fieldName_locale: {
          entityType,
          entityId,
          fieldName,
          locale: lang,
        },
      },
    });
    if (loc && loc.content) {
      return JSON.parse(loc.content);
    }
  } catch {
    // Return default or parsing error fallback
  }
  return defaultValue;
}

// ─── CMS Global Settings Handlers ─────────────────────────────────────────────

export async function getCmsSettings(): Promise<any> {
  const settings = await prisma.cmsSetting.findMany();
  const res: Record<string, any> = {};
  for (const s of settings) {
    res[s.key] = s.value;
  }
  return res;
}

export async function updateCmsSetting(key: string, value: any) {
  return await prisma.cmsSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

// ─── Generic CMS Collections (Flex/JSON storage) ──────────────────────────────

export async function getCmsCollection<T = any>(collection: string): Promise<T[]> {
  const items = await prisma.cmsCollectionItem.findMany({
    where: { collection },
    orderBy: { createdAt: "asc" },
  });
  return items.map((i) => ({
    ...(i.data as any),
    id: i.id,
  }));
}

export async function getCmsItem<T = any>(collection: string, id: string): Promise<T | null> {
  const item = await prisma.cmsCollectionItem.findUnique({
    where: { id },
  });
  if (!item || item.collection !== collection) return null;
  return {
    ...(item.data as any),
    id: item.id,
  };
}

export async function upsertCmsItem(collection: string, data: any) {
  const id = data.id || undefined;
  if (id) {
    const item = await prisma.cmsCollectionItem.update({
      where: { id },
      data: { data },
    });
    return { ...(item.data as any), id: item.id };
  } else {
    const item = await prisma.cmsCollectionItem.create({
      data: { collection, data },
    });
    const updatedData = { ...data, id: item.id };
    await prisma.cmsCollectionItem.update({
      where: { id: item.id },
      data: { data: updatedData },
    });
    return updatedData;
  }
}

export async function updateCmsItem(collection: string, id: string, patch: any) {
  const existing = await prisma.cmsCollectionItem.findUnique({
    where: { id },
  });
  if (!existing || existing.collection !== collection) return null;

  const newData = {
    ...(existing.data as any),
    ...patch,
    id,
  };

  const item = await prisma.cmsCollectionItem.update({
    where: { id },
    data: { data: newData },
  });

  return newData;
}

export async function deleteCmsItem(collection: string, id: string): Promise<boolean> {
  try {
    await prisma.cmsCollectionItem.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

// ─── Relational Visa Requirements Queries ──────────────────────────────────────

export async function getCountry(countryCode: string, lang = "en"): Promise<CountryVisaProfile | null> {
  const country = await prisma.country.findUnique({
    where: { countryCode },
  });
  if (!country) return null;

  const name = await getLocalizedValue("country", country.id, "countryName", lang, country.countryName);

  return {
    countryCode: country.countryCode,
    countryName: name,
    flag: country.flag,
    embassyUrl: country.embassyUrl,
    continent: country.continent,
    capital: country.capital,
    currency: country.currency,
    visaFreeForEgyptian: country.visaFreeForEgyptian,
    visaTypes: [],
  };
}

export async function getVisaTypesForCountry(countryCode: string, lang = "en"): Promise<any[]> {
  const visaTypes = await prisma.visaType.findMany({
    where: { countryCode },
    include: {
      documents: {
        include: { document: true },
      },
    },
  });

  return await Promise.all(
    visaTypes.map(async (vt) => {
      const label = await getLocalizedValue("visaType", vt.id, "label", lang, vt.label);
      const description = await getLocalizedValue("visaType", vt.id, "description", lang, vt.description);

      return {
        id: vt.id.split("::")[1] || vt.id,
        label,
        description,
        icon: vt.icon,
        processingTime: vt.processingTime,
        governmentFee: vt.governmentFee,
        maxStay: vt.maxStay,
        validity: vt.validity,
        eVisa: vt.eVisa,
        visaOnArrival: vt.visaOnArrival,
        documentCount: vt.documents.length,
        requiredDocumentCount: vt.documents.filter((d) => d.document.required).length,
      };
    })
  );
}

export async function getRequirements(countryCode: string, visaTypeId: string, lang = "en"): Promise<VisaDocument[]> {
  const fullTypeId = `${countryCode}::${visaTypeId}`;
  const vtDocs = await prisma.visaTypeDocument.findMany({
    where: { visaTypeId: fullTypeId },
    include: { document: true },
  });

  return await Promise.all(
    vtDocs.map(async (vtd) => {
      const label = await getLocalizedValue("document", vtd.document.id, "label", lang, vtd.document.label);
      const description = await getLocalizedValue("document", vtd.document.id, "description", lang, vtd.document.description);

      const registryEntry = DOCUMENT_REGISTRY[vtd.document.id];
      return {
        id: vtd.document.id,
        label,
        description,
        required: vtd.document.required,
        sampleUrl: vtd.document.sampleUrl || undefined,
        icon: registryEntry?.icon || "description",
        allowedTypes: registryEntry?.allowedTypes || ["pdf", "jpg", "jpeg", "png"],
        maxSizeMB: registryEntry?.maxSizeMB || 10,
        multiple: registryEntry?.multiple,
        notes: registryEntry?.notes,
      };
    })
  );
}

export async function updateRequirement(countryCode: string, visaTypeId: string, docId: string, patch: any) {
  const doc = await prisma.visaDocument.update({
    where: { id: docId },
    data: {
      label: patch.label,
      description: patch.description,
      required: patch.required,
      sampleUrl: patch.sampleUrl,
    },
  });

  return {
    id: doc.id,
    label: doc.label,
    description: doc.description,
    required: doc.required,
    sampleUrl: doc.sampleUrl || undefined,
  };
}

export async function addRequirement(countryCode: string, visaTypeId: string, document: any) {
  const fullTypeId = `${countryCode}::${visaTypeId}`;

  const doc = await prisma.visaDocument.upsert({
    where: { id: document.id },
    update: {
      label: document.label,
      description: document.description,
      required: document.required,
      sampleUrl: document.sampleUrl,
    },
    create: {
      id: document.id,
      label: document.label,
      description: document.description,
      required: document.required,
      sampleUrl: document.sampleUrl,
    },
  });

  await prisma.visaTypeDocument.upsert({
    where: {
      visaTypeId_documentId: {
        visaTypeId: fullTypeId,
        documentId: doc.id,
      },
    },
    update: {},
    create: {
      visaTypeId: fullTypeId,
      documentId: doc.id,
    },
  });

  return {
    id: doc.id,
    label: doc.label,
    description: doc.description,
    required: doc.required,
    sampleUrl: doc.sampleUrl || undefined,
  };
}

export async function removeRequirement(countryCode: string, visaTypeId: string, docId: string): Promise<boolean> {
  const fullTypeId = `${countryCode}::${visaTypeId}`;
  try {
    await prisma.visaTypeDocument.delete({
      where: {
        visaTypeId_documentId: {
          visaTypeId: fullTypeId,
          documentId: docId,
        },
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getDocumentRegistry(): Promise<Record<string, VisaDocument>> {
  const docs = await prisma.visaDocument.findMany();
  const registry: Record<string, VisaDocument> = {};
  for (const d of docs) {
    const registryEntry = DOCUMENT_REGISTRY[d.id];
    registry[d.id] = {
      id: d.id,
      label: d.label,
      description: d.description,
      required: d.required,
      sampleUrl: d.sampleUrl || undefined,
      icon: registryEntry?.icon || "description",
      allowedTypes: registryEntry?.allowedTypes || ["pdf", "jpg", "jpeg", "png"],
      maxSizeMB: registryEntry?.maxSizeMB || 10,
      multiple: registryEntry?.multiple,
      notes: registryEntry?.notes,
    };
  }
  return registry;
}

// ─── Custom Domain CMS Entities (Translation Wrapping) ──────────────────────────

export async function getPackages(lang = "en") {
  const packages = await getCmsCollection("packages");
  return await Promise.all(
    packages.map(async (pkg) => ({
      ...pkg,
      title: await getLocalizedValue("package", pkg.id, "title", lang, pkg.title),
      subtitle: await getLocalizedValue("package", pkg.id, "subtitle", lang, pkg.subtitle),
      destinationLabel: await getLocalizedValue("package", pkg.id, "destinationLabel", lang, pkg.destinationLabel),
      highlights: await getLocalizedArray("package", pkg.id, "highlights", lang, pkg.highlights),
      includes: await getLocalizedArray("package", pkg.id, "includes", lang, pkg.includes),
    }))
  );
}

export async function getHotels(lang = "en") {
  const hotels = await getCmsCollection("hotels");
  return await Promise.all(
    hotels.map(async (hot) => ({
      ...hot,
      name: await getLocalizedValue("hotel", hot.id, "name", lang, hot.name),
      location: await getLocalizedValue("hotel", hot.id, "location", lang, hot.location),
      city: await getLocalizedValue("hotel", hot.id, "city", lang, hot.city),
      description: await getLocalizedValue("hotel", hot.id, "description", lang, hot.description),
      category: await getLocalizedValue("hotel", hot.id, "category", lang, hot.category),
      amenities: await getLocalizedArray("hotel", hot.id, "amenities", lang, hot.amenities),
    }))
  );
}

export async function getFlights(lang = "en") {
  const flights = await getCmsCollection("flights");
  return await Promise.all(
    flights.map(async (fl) => {
      const airline = await getLocalizedValue("flight", fl.id, "airline", lang, fl.airline);
      const fromCity = await getLocalizedValue("flight", fl.id, "fromCity", lang, fl.fromCity);
      const toCity = await getLocalizedValue("flight", fl.id, "toCity", lang, fl.toCity);

      return {
        ...fl,
        airline,
        fromCity,
        toCity,
        from: `${fromCity} (${fl.fromCode})`,
        to: `${toCity} (${fl.toCode})`,
      };
    })
  );
}

export async function getDestinations(lang = "en") {
  const destinations = await getCmsCollection("destinations");
  return await Promise.all(
    destinations.map(async (d) => ({
      ...d,
      name: await getLocalizedValue("destination", d.id, "name", lang, d.name),
      location: await getLocalizedValue("destination", d.id, "location", lang, d.location),
      description: await getLocalizedValue("destination", d.id, "description", lang, d.description),
      category: await getLocalizedValue("destination", d.id, "category", lang, d.category),
      price: lang === "ar" ? d.price.replace("From $", "تبدأ من ") + " $" : d.price,
      duration: lang === "ar" ? d.duration.replace("nights", "ليالي").replace("night", "ليلة") : d.duration,
    }))
  );
}

export async function getHomeContent(lang = "en") {
  const settings = await getCmsSettings();
  return {
    settings: settings.home || {},
    company: settings.company || {},
    stats: await getCmsCollection("stats"),
    testimonials: await getCmsCollection("testimonials"),
    shortcuts: await getCmsCollection("homeShortcuts"),
    services: await getCmsCollection("services"),
    destinations: await getDestinations(lang),
  };
}

// ─── File Storage System ──────────────────────────────────────────────────────

export async function storeFile(file: Omit<StoredFile, "fileId" | "uploadedAt">): Promise<StoredFile> {
  const fileId = `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const stored = await prisma.storedFile.create({
    data: {
      fileId,
      documentId: file.documentId,
      documentLabel: file.documentLabel,
      applicationId: file.applicationId,
      originalName: file.originalName,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      content: file.content,
    },
  });

  return {
    ...stored,
    uploadedAt: stored.uploadedAt.toISOString(),
  };
}

export async function getFile(fileId: string): Promise<StoredFile | null> {
  const file = await prisma.storedFile.findUnique({
    where: { fileId },
  });
  if (!file) return null;
  return {
    ...file,
    uploadedAt: file.uploadedAt.toISOString(),
  };
}

// ─── Visa Application Request Logic ───────────────────────────────────────────

export async function getAllApplications(): Promise<VisaApplication[]> {
  const list = await prisma.visaApplication.findMany({
    orderBy: { submittedAt: "desc" },
    include: {
      files: true,
      internalNotes: true,
    },
  });

  return list.map((a) => ({
    id: a.id,
    countryCode: a.countryCode,
    countryName: a.countryName,
    countryFlag: a.countryFlag,
    visaTypeId: a.visaTypeId,
    visaTypeLabel: a.visaTypeLabel,
    applicant: {
      firstName: a.applicantFirstName,
      lastName: a.applicantLastName,
      email: a.applicantEmail,
      phone: a.applicantPhone,
      nationality: a.applicantNationality,
      passportNumber: a.applicantPassportNumber,
      dateOfBirth: a.applicantDateOfBirth,
      travelDate: a.travelDate,
      returnDate: a.returnDate || undefined,
    },
    status: a.status as ApplicationStatus,
    assignedTo: a.assignedTo,
    fileIds: a.files.map((f) => f.fileId),
    internalNotes: a.internalNotes.map((n) => ({
      id: n.id,
      author: n.author,
      content: n.content,
      time: n.time.toISOString(),
    })),
    notes: a.notes || undefined,
    governmentFee: a.governmentFee || undefined,
    processingTime: a.processingTime || undefined,
    submittedAt: a.submittedAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));
}

export async function getApplication(id: string): Promise<VisaApplication | null> {
  const a = await prisma.visaApplication.findUnique({
    where: { id },
    include: {
      files: true,
      internalNotes: { orderBy: { time: "desc" } },
    },
  });
  if (!a) return null;

  return {
    id: a.id,
    countryCode: a.countryCode,
    countryName: a.countryName,
    countryFlag: a.countryFlag,
    visaTypeId: a.visaTypeId,
    visaTypeLabel: a.visaTypeLabel,
    applicant: {
      firstName: a.applicantFirstName,
      lastName: a.applicantLastName,
      email: a.applicantEmail,
      phone: a.applicantPhone,
      nationality: a.applicantNationality,
      passportNumber: a.applicantPassportNumber,
      dateOfBirth: a.applicantDateOfBirth,
      travelDate: a.travelDate,
      returnDate: a.returnDate || undefined,
    },
    status: a.status as ApplicationStatus,
    assignedTo: a.assignedTo,
    fileIds: a.files.map((f) => f.fileId),
    internalNotes: a.internalNotes.map((n) => ({
      id: n.id,
      author: n.author,
      content: n.content,
      time: n.time.toISOString(),
    })),
    notes: a.notes || undefined,
    governmentFee: a.governmentFee || undefined,
    processingTime: a.processingTime || undefined,
    submittedAt: a.submittedAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export async function createApplication(data: any, lang = "en"): Promise<VisaApplication> {
  const id = `VIS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const now = new Date();

  const app = await prisma.visaApplication.create({
    data: {
      id,
      countryCode: data.countryCode,
      countryName: data.countryName,
      countryFlag: data.countryFlag,
      visaTypeId: data.visaTypeId,
      visaTypeLabel: data.visaTypeLabel,
      applicantFirstName: data.applicant.firstName,
      applicantLastName: data.applicant.lastName,
      applicantEmail: data.applicant.email,
      applicantPhone: data.applicant.phone,
      applicantNationality: data.applicant.nationality,
      applicantPassportNumber: data.applicant.passportNumber,
      applicantDateOfBirth: data.applicant.dateOfBirth,
      travelDate: data.applicant.travelDate,
      returnDate: data.applicant.returnDate || null,
      status: "Pending",
      assignedTo: "",
      notes: data.notes || null,
      governmentFee: data.governmentFee || null,
      processingTime: data.processingTime || null,
      submittedAt: now,
      updatedAt: now,
    },
  });

  // Link any pre-stored files
  if (Array.isArray(data.fileIds) && data.fileIds.length > 0) {
    await prisma.storedFile.updateMany({
      where: { fileId: { in: data.fileIds } },
      data: { applicationId: id },
    });
  }

  // ── Dynamic Side Effects ──────────────────────────────────────────────────────

  const isArabic = lang === "ar";

  await prisma.adminNotification.create({
    data: {
      applicationId: id,
      message: isArabic
        ? `طلب تأشيرة جديد: ${data.applicant.firstName} ${data.applicant.lastName} ← ${data.countryName} [${id}]`
        : `New Visa Application: ${data.applicant.firstName} ${data.applicant.lastName} → ${data.countryName} [${id}]`,
      time: now,
    },
  });

  await prisma.emailLog.create({
    data: {
      applicationId: id,
      to: "info@cairohangzhou.com",
      subject: `[NEW VISA APPLICATION] ${data.applicant.firstName} ${data.applicant.lastName} → ${data.countryName} — ${id}`,
      body: `A new visa application has been submitted.\n\nApplication ID: ${id}\nApplicant: ${data.applicant.firstName} ${data.applicant.lastName}\nDestination: ${data.countryName}\nVisa Type: ${data.visaTypeLabel}`,
      type: "company_notification",
      sentAt: now,
    },
  });

  await prisma.emailLog.create({
    data: {
      applicationId: id,
      to: data.applicant.email,
      subject: isArabic ? `تم استلام طلب التأشيرة الخاص بك رقم ${id}` : `Your Visa Application ${id} Has Been Received`,
      body: isArabic
        ? `عزيزنا ${data.applicant.firstName}،\n\nلقد استلمنا بنجاح طلب التأشيرة الخاص بك إلى ${data.countryName}.\n\nالرقم المرجعي للطلب هو: ${id}`
        : `Dear ${data.applicant.firstName},\n\nWe have successfully received your visa application for ${data.countryName}.\n\nYour reference ID is: ${id}`,
      type: "customer_confirmation",
      sentAt: now,
    },
  });

  await prisma.activityLog.create({
    data: {
      applicationId: id,
      action: isArabic ? "تم إنشاء الطلب" : "Application Created",
      details: isArabic
        ? `تم إرسال الطلب عبر البوابة الإلكترونية لـ ${data.countryName}.`
        : `Submitted via online portal for ${data.countryName}.`,
      actor: "Customer",
      time: now,
    },
  });

  return (await getApplication(id))!;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus, actor = "Admin", lang = "en"): Promise<VisaApplication | null> {
  const app = await prisma.visaApplication.findUnique({
    where: { id },
  });
  if (!app) return null;

  const now = new Date();
  const updated = await prisma.visaApplication.update({
    where: { id },
    data: {
      status,
      updatedAt: now,
    },
  });

  const isArabic = lang === "ar";

  await prisma.activityLog.create({
    data: {
      applicationId: id,
      action: isArabic ? "تحديث الحالة" : "Status Updated",
      details: isArabic
        ? `تغيرت حالة الطلب من "${app.status}" إلى "${status}"`
        : `Status changed from "${app.status}" to "${status}"`,
      actor,
      time: now,
    },
  });

  await prisma.emailLog.create({
    data: {
      applicationId: id,
      to: app.applicantEmail,
      subject: isArabic ? `تحديث حالة طلب التأشيرة رقم ${id}` : `Status Update for Visa Application ${id}`,
      body: isArabic
        ? `تم تحديث حالة طلب التأشيرة الخاص بك إلى: ${status}`
        : `Your application status has been updated to: ${status}`,
      type: "status_update",
      sentAt: now,
    },
  });

  return await getApplication(id);
}

export async function assignApplication(id: string, employee: string): Promise<VisaApplication | null> {
  const updated = await prisma.visaApplication.update({
    where: { id },
    data: {
      assignedTo: employee,
      updatedAt: new Date(),
    },
  });

  await prisma.activityLog.create({
    data: {
      applicationId: id,
      action: "Application Assigned",
      details: `Assigned to employee: ${employee}`,
      actor: "System",
    },
  });

  return await getApplication(id);
}

export async function addNote(id: string, content: string, author: string): Promise<VisaApplication | null> {
  await prisma.internalNote.create({
    data: {
      applicationId: id,
      content,
      author,
    },
  });

  return await getApplication(id);
}

// ─── Notification & Logs Handlers ─────────────────────────────────────────────

export async function getNotifications(): Promise<AdminNotification[]> {
  const list = await prisma.adminNotification.findMany({
    orderBy: { time: "desc" },
  });
  return list.map((n) => ({
    ...n,
    time: n.time.toISOString(),
  }));
}

export async function markNotificationRead(id: string): Promise<void> {
  await prisma.adminNotification.update({
    where: { id },
    data: { read: true },
  });
}

export async function getEmailLogs(applicationId?: string): Promise<EmailLog[]> {
  const list = await prisma.emailLog.findMany({
    where: applicationId ? { applicationId } : undefined,
    orderBy: { sentAt: "desc" },
  });
  return list.map((e) => ({
    id: e.id,
    applicationId: e.applicationId,
    to: e.to,
    subject: e.subject,
    body: e.body,
    type: e.type as any,
    sentAt: e.sentAt.toISOString(),
  }));
}

export async function getActivityLogs(applicationId?: string): Promise<ActivityLog[]> {
  const list = await prisma.activityLog.findMany({
    where: applicationId ? { applicationId } : undefined,
    orderBy: { time: "desc" },
  });
  return list.map((a) => ({
    ...a,
    time: a.time.toISOString(),
  }));
}

export async function getUnreadNotificationCount(): Promise<number> {
  return await prisma.adminNotification.count({
    where: { read: false },
  });
}

// ─── RBAC Authorization Handlers ──────────────────────────────────────────────

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return (user as unknown as User) || undefined;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return (user as unknown as User) || undefined;
}

export async function getUserRoles(userId: string): Promise<Role[]> {
  const mappings = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return mappings.map((m) => m.role);
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  const roles = await getUserRoles(userId);
  const roleIds = roles.map((r) => r.id);

  const rolePerms = await prisma.rolePermission.findMany({
    where: { roleId: { in: roleIds } },
    include: { permission: true },
  });

  return Array.from(new Set(rolePerms.map((rp) => rp.permission.code)));
}

export async function createSession(userId: string): Promise<UserSession> {
  const token = `sess_${Math.random().toString(36).substring(2)}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const session = await prisma.userSession.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return {
    token: session.token,
    userId: session.userId,
    expiresAt: session.expiresAt.toISOString(),
  };
}

export async function getSession(token: string): Promise<UserSession | undefined> {
  const session = await prisma.userSession.findUnique({
    where: { token },
  });
  if (!session) return undefined;

  if (new Date(session.expiresAt) < new Date()) {
    await prisma.userSession.delete({ where: { token } });
    return undefined;
  }

  return {
    token: session.token,
    userId: session.userId,
    expiresAt: session.expiresAt.toISOString(),
  };
}

export async function deleteSession(token: string): Promise<boolean> {
  try {
    await prisma.userSession.delete({
      where: { token },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getAllUsersWithRoles() {
  const list = await prisma.user.findMany({
    include: {
      userRoles: {
        include: { role: true },
      },
    },
  });

  return list.map((user) => {
    const roles = user.userRoles.map((ur) => ur.role.name);
    const roleIds = user.userRoles.map((ur) => ur.role.id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      status: user.status as any,
      joinedDate: user.joinedDate,
      roles,
      roleIds,
    };
  });
}

export async function updateUserRole(userId: string, roleId: string): Promise<boolean> {
  try {
    await prisma.userRole.deleteMany({
      where: { userId },
    });
    await prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getAllRoles(): Promise<Role[]> {
  return await prisma.role.findMany();
}

export async function getAllPermissions(): Promise<Permission[]> {
  return await prisma.permission.findMany();
}

export async function getRolePermissions(roleId: string): Promise<string[]> {
  const mappings = await prisma.rolePermission.findMany({
    where: { roleId },
    include: { permission: true },
  });
  return mappings.map((m) => m.permission.code);
}

export async function updateRolePermissions(roleId: string, permissionCodes: string[]): Promise<boolean> {
  try {
    const perms = await prisma.permission.findMany({
      where: { code: { in: permissionCodes } },
    });

    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    const createData = perms.map((p) => ({
      roleId,
      permissionId: p.id,
    }));

    await prisma.rolePermission.createMany({
      data: createData,
    });

    return true;
  } catch {
    return false;
  }
}

// ─── Travel Request Management (Flight / Hotel / Package requests) ─────────────

export type RequestType = "visa" | "flight" | "hotel" | "package" | "custom";
export type RequestStatus = "Pending" | "Under Review" | "Documents Required" | "Approved" | "Rejected" | "Completed";

export interface TravelRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  type: RequestType;
  title: string;
  details: string;
  status: RequestStatus;
  amount: number;
  assignedTo: string;
  createdTime: string;
  documents: { name: string; size: string }[];
  internalNotes: { id: string; author: string; content: string; time: string }[];
}

export async function getTravelRequests(): Promise<TravelRequest[]> {
  return await getCmsCollection<TravelRequest>("travelRequests");
}

export async function createTravelRequest(
  data: Omit<TravelRequest, "id" | "status" | "internalNotes" | "createdTime" | "assignedTo" | "documents"> & {
    documents?: { name: string; size: string }[];
  }
): Promise<TravelRequest> {
  const id = `REQ-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const now = new Date().toISOString();
  const req: TravelRequest = {
    ...data,
    id,
    status: "Pending",
    assignedTo: "",
    createdTime: now,
    documents: data.documents || [],
    internalNotes: [],
  };
  await upsertCmsItem("travelRequests", req);
  return req;
}

export async function updateTravelRequestStatus(
  id: string,
  status: RequestStatus
): Promise<TravelRequest | null> {
  const item = await updateCmsItem("travelRequests", id, {
    status,
  });
  return item as TravelRequest | null;
}

export async function addTravelRequestNote(
  id: string,
  content: string,
  author: string
): Promise<TravelRequest | null> {
  const existing = await getCmsItem<TravelRequest>("travelRequests", id);
  if (!existing) return null;
  const noteId = `note-${Date.now()}`;
  const notes = [
    ...(existing.internalNotes ?? []),
    { id: noteId, author, content, time: new Date().toISOString() },
  ];
  const item = await updateCmsItem("travelRequests", id, {
    internalNotes: notes,
  });
  return item as TravelRequest | null;
}

export async function assignTravelRequest(
  id: string,
  employee: string
): Promise<TravelRequest | null> {
  const item = await updateCmsItem("travelRequests", id, {
    assignedTo: employee,
  });
  return item as TravelRequest | null;
}

export async function getTravelActivityLogs(): Promise<any[]> {
  return await getActivityLogs();
}

export async function getTravelEmailLogs(): Promise<any[]> {
  return await getEmailLogs();
}

