import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import {
  getCountry,
  getVisaTypesForCountry,
  getRequirements,
  createApplication,
  getFile,
} from "@/lib/server-store";

/**
 * POST /api/visa/submit
 * Full visa application submission lifecycle:
 *   1. Validate country + visa type against database
 *   2. Validate all required documents have been uploaded
 *   3. createApplication() → saves app + creates notification + logs emails + logs activity
 *   4. Return application ID and next steps
 */
export async function POST(request: Request) {
  const auth = await requirePermission(request, "visa.create");
  if (auth instanceof NextResponse) return auth;

  let body: {
    countryCode: string;
    visaTypeId: string;
    lang?: string;
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
    uploadedFiles: { fileId: string; documentId: string }[];
    notes?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { countryCode, visaTypeId, lang = "en", applicant, uploadedFiles, notes } = body;

  if (!countryCode || !visaTypeId) {
    return NextResponse.json(
      { error: "countryCode and visaTypeId are required." },
      { status: 400 }
    );
  }

  if (
    !applicant?.firstName ||
    !applicant?.lastName ||
    !applicant?.email ||
    !applicant?.passportNumber
  ) {
    return NextResponse.json(
      { error: "Applicant firstName, lastName, email, and passportNumber are required." },
      { status: 400 }
    );
  }

  const country = await getCountry(countryCode, lang);
  if (!country) {
    return NextResponse.json({ error: `Unknown country: ${countryCode}` }, { status: 400 });
  }

  const allTypes = await getVisaTypesForCountry(countryCode, lang);
  const visaType = allTypes.find((vt: any) => vt.id === visaTypeId);
  if (!visaType) {
    return NextResponse.json(
      { error: `Unknown visa type '${visaTypeId}' for ${countryCode}` },
      { status: 400 }
    );
  }

  // Validate required documents
  const requiredDocs = (await getRequirements(countryCode, visaTypeId, lang)).filter((d) => d.required);
  const uploadedDocIds = new Set((uploadedFiles ?? []).map((f) => f.documentId));
  const missingDocs = requiredDocs.filter((d) => !uploadedDocIds.has(d.id));

  if (missingDocs.length > 0) {
    return NextResponse.json(
      {
        error: "Missing required documents",
        missingDocuments: missingDocs.map((d) => ({ id: d.id, label: d.label })),
      },
      { status: 422 }
    );
  }

  // Verify all fileIds exist in the file store
  const validFileIds: string[] = [];
  const invalidFileIds: string[] = [];
  for (const { fileId } of uploadedFiles ?? []) {
    const file = await getFile(fileId);
    if (file) {
      validFileIds.push(fileId);
    } else {
      invalidFileIds.push(fileId);
    }
  }

  if (invalidFileIds.length > 0) {
    return NextResponse.json(
      { error: `Some file IDs are invalid or expired: ${invalidFileIds.join(", ")}` },
      { status: 422 }
    );
  }

  const app = await createApplication(
    {
      countryCode: country.countryCode,
      countryName: country.countryName,
      countryFlag: country.flag,
      visaTypeId: visaType.id,
      visaTypeLabel: visaType.label,
      applicant: {
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        phone: applicant.phone ?? "",
        nationality: applicant.nationality ?? "",
        passportNumber: applicant.passportNumber,
        dateOfBirth: applicant.dateOfBirth ?? "",
        travelDate: applicant.travelDate ?? "",
        returnDate: applicant.returnDate,
      },
      fileIds: validFileIds,
      notes: notes ?? "",
      governmentFee: visaType.governmentFee,
      processingTime: visaType.processingTime,
    },
    lang
  );

  const isArabic = lang === "ar";

  return NextResponse.json({
    success: true,
    applicationId: app.id,
    status: app.status,
    message: isArabic
      ? `لقد تم استلام طلب التأشيرة الخاص بك إلى ${country.countryName}. سيقوم فريقنا بمراجعته خلال 24 ساعة.`
      : `Your visa application for ${country.countryName} has been received. Our team will review it within 24 hours.`,
    processingTime: visaType.processingTime,
    nextSteps: isArabic
      ? [
          "ستتلقى رسالة تأكيد بالبريد الإلكتروني خلال دقائق.",
          "سيقوم خبير التأشيرات لدينا بمراجعة مستنداتك خلال 24 ساعة.",
          `وقت المعالجة المتوقع: ${visaType.processingTime}`,
          "يمكنك تتبع حالة طلبك باستخدام رقم مرجع الطلب الخاص بك.",
        ]
      : [
          "You will receive a confirmation email within minutes.",
          "Our visa specialist will review your documents within 24 hours.",
          `Expected processing time: ${visaType.processingTime}`,
          "You can track your application status by referencing your Application ID.",
        ],
  });
}
