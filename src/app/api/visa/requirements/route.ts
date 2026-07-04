import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import {
  getCountry,
  getVisaTypesForCountry,
  getRequirements,
  updateRequirement,
  addRequirement,
  removeRequirement,
  getDocumentRegistry,
} from "@/lib/server-store";

/**
 * GET /api/visa/requirements?country=DE
 *   → Returns all visa types for that country
 *
 * GET /api/visa/requirements?country=DE&type=tourist
 *   → Returns the full document list for that country+type
 *
 * GET /api/visa/requirements?registry=true
 *   → Returns the full document registry (for admin "add document" UI)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get("country");
  const visaTypeId = searchParams.get("type");
  const registry = searchParams.get("registry") === "true";
  const lang = searchParams.get("lang") || "en";

  if (registry) {
    const docs = await getDocumentRegistry();
    return NextResponse.json({ documents: Object.values(docs) });
  }

  if (!countryCode) {
    return NextResponse.json({ error: "Missing required parameter: country" }, { status: 400 });
  }

  const country = await getCountry(countryCode, lang);
  if (!country) {
    return NextResponse.json({ error: `Country not found: ${countryCode}` }, { status: 404 });
  }

  if (!visaTypeId) {
    const types = await getVisaTypesForCountry(countryCode, lang);
    return NextResponse.json({
      countryCode: country.countryCode,
      countryName: country.countryName,
      flag: country.flag,
      embassyUrl: country.embassyUrl,
      visaTypes: types.map((vt: any) => ({
        id: vt.id,
        label: vt.label,
        description: vt.description,
        icon: vt.icon,
        processingTime: vt.processingTime,
        governmentFee: vt.governmentFee,
        maxStay: vt.maxStay,
        validity: vt.validity,
        eVisa: vt.eVisa,
        visaOnArrival: vt.visaOnArrival,
        documentCount: vt.documentCount,
        requiredDocumentCount: vt.requiredDocumentCount,
      })),
    });
  }

  const allTypes = await getVisaTypesForCountry(countryCode, lang);
  const visaType = allTypes.find((vt: any) => vt.id === visaTypeId);
  if (!visaType) {
    return NextResponse.json({ error: `Visa type '${visaTypeId}' not found for ${countryCode}` }, { status: 404 });
  }

  const docs = await getRequirements(countryCode, visaTypeId, lang);

  return NextResponse.json({
    countryCode: country.countryCode,
    countryName: country.countryName,
    flag: country.flag,
    visaType: {
      id: visaType.id,
      label: visaType.label,
      description: visaType.description,
      processingTime: visaType.processingTime,
      governmentFee: visaType.governmentFee,
      maxStay: visaType.maxStay,
      validity: visaType.validity,
      eVisa: visaType.eVisa,
      visaOnArrival: visaType.visaOnArrival,
    },
    requiredDocuments: docs,
  });
}

/**
 * POST /api/visa/requirements — Add a new document requirement
 * PUT  /api/visa/requirements — Update an existing document requirement
 * DELETE /api/visa/requirements — Remove a document requirement
 */
export async function POST(request: Request) {
  const auth = await requirePermission(request, "visa.update");
  if (auth instanceof NextResponse) return auth;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { countryCode, visaTypeId, document } = body;
  if (!countryCode || !visaTypeId || !document?.id || !document?.label) {
    return NextResponse.json(
      { error: "countryCode, visaTypeId, and document (with id and label) are required" },
      { status: 400 }
    );
  }

  const doc = await addRequirement(countryCode, visaTypeId, document);
  return NextResponse.json({ success: true, document: doc });
}

export async function PUT(request: Request) {
  const auth = await requirePermission(request, "visa.update");
  if (auth instanceof NextResponse) return auth;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { countryCode, visaTypeId, docId, patch } = body;
  if (!countryCode || !visaTypeId || !docId || !patch) {
    return NextResponse.json(
      { error: "countryCode, visaTypeId, docId, and patch are required" },
      { status: 400 }
    );
  }

  const doc = await updateRequirement(countryCode, visaTypeId, docId, patch);
  if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  return NextResponse.json({ success: true, document: doc });
}

export async function DELETE(request: Request) {
  const auth = await requirePermission(request, "visa.update");
  if (auth instanceof NextResponse) return auth;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { countryCode, visaTypeId, docId } = body;
  if (!countryCode || !visaTypeId || !docId) {
    return NextResponse.json(
      { error: "countryCode, visaTypeId, and docId are required" },
      { status: 400 }
    );
  }

  const success = await removeRequirement(countryCode, visaTypeId, docId);
  return NextResponse.json({ success });
}
