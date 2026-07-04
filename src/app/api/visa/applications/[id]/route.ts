import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import {
  getApplication,
  getFile,
  getEmailLogs,
  getActivityLogs,
} from "@/lib/server-store";

/**
 * GET /api/visa/applications/[id]
 * Returns full application detail including internal notes, email logs, activity timeline,
 * and file metadata.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { user, permissions } = auth;
  const { id } = await params;
  const app = await getApplication(id);

  if (!app) {
    return NextResponse.json({ error: `Application not found: ${id}` }, { status: 404 });
  }

  // Restrict customers to their own application detail
  if (!permissions.includes("visa.read")) {
    if (permissions.includes("customer.access") && app.applicant.email === user.email) {
      // Allowed
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Attach file metadata (not base64 content) for the admin UI
  const files = await Promise.all(
    app.fileIds.map(async (fid) => {
      const f = await getFile(fid);
      return f
        ? {
            fileId: f.fileId,
            documentId: f.documentId,
            documentLabel: f.documentLabel,
            originalName: f.originalName,
            mimeType: f.mimeType,
            sizeBytes: f.sizeBytes,
            uploadedAt: f.uploadedAt,
          }
        : null;
    })
  );

  const [emails, activity] = await Promise.all([
    getEmailLogs(id),
    getActivityLogs(id),
  ]);

  return NextResponse.json({
    application: {
      ...app,
      files: files.filter(Boolean),
      emailLogs: emails,
      activityLog: activity,
    },
  });
}
