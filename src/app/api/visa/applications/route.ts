import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { getAllApplications } from "@/lib/server-store";

/**
 * GET /api/visa/applications
 * Returns all visa applications from the PostgreSQL database.
 * Used exclusively by the Admin Dashboard.
 *
 * Query params:
 *   status?  — filter by ApplicationStatus
 *   search?  — filter by applicant name, email, passport, country, or application ID
 *   page?    — page number (default: 1)
 *   limit?   — items per page (default: 20)
 */
export async function GET(request: Request) {
  const auth = await requirePermission(request, "visa.read");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  let apps = await getAllApplications();

  if (status && status !== "All") {
    apps = apps.filter((a) => a.status === status);
  }

  if (search) {
    apps = apps.filter(
      (a) =>
        a.id.toLowerCase().includes(search) ||
        a.applicant.firstName.toLowerCase().includes(search) ||
        a.applicant.lastName.toLowerCase().includes(search) ||
        a.applicant.email.toLowerCase().includes(search) ||
        a.applicant.passportNumber.toLowerCase().includes(search) ||
        a.countryName.toLowerCase().includes(search) ||
        a.visaTypeLabel.toLowerCase().includes(search)
    );
  }

  const total = apps.length;
  const start = (page - 1) * limit;
  const paginated = apps.slice(start, start + limit);

  return NextResponse.json({
    applications: paginated.map((a) => ({
      id: a.id,
      countryCode: a.countryCode,
      countryName: a.countryName,
      countryFlag: a.countryFlag,
      visaTypeId: a.visaTypeId,
      visaTypeLabel: a.visaTypeLabel,
      applicantName: `${a.applicant.firstName} ${a.applicant.lastName}`,
      applicantEmail: a.applicant.email,
      applicantPhone: a.applicant.phone,
      nationality: a.applicant.nationality,
      passportNumber: a.applicant.passportNumber,
      travelDate: a.applicant.travelDate,
      status: a.status,
      assignedTo: a.assignedTo,
      fileCount: a.fileIds.length,
      noteCount: a.internalNotes.length,
      governmentFee: a.governmentFee,
      processingTime: a.processingTime,
      submittedAt: a.submittedAt,
      updatedAt: a.updatedAt,
    })),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
}
