import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-middleware";
import { storeFile } from "@/lib/server-store";

/**
 * POST /api/visa/upload
 * Accepts a multipart/form-data file upload.
 * Stores the file in PostgreSQL via Prisma (base64 content field).
 * Returns a fileId included in the visa application submission payload.
 *
 * Form fields:
 *   file          — The file binary
 *   documentId    — Which document slot this satisfies (e.g. "passport", "bank_statement")
 *   documentLabel — Human-readable label
 *   applicationId — Optional: "" on initial upload, filled on resubmit
 */
export async function POST(request: Request) {
  const auth = await requirePermission(request, "visa.create");
  if (auth instanceof NextResponse) return auth;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const documentId = formData.get("documentId") as string | null;
  const documentLabel = formData.get("documentLabel") as string | null;

  if (!file || !documentId) {
    return NextResponse.json({ error: "file and documentId are required" }, { status: 400 });
  }

  // Validate size (max 10 MB per file)
  const MAX_BYTES = 10 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File exceeds maximum allowed size of 10 MB. Received: ${(file.size / 1024 / 1024).toFixed(1)} MB` },
      { status: 413 }
    );
  }

  // Read file to buffer → base64 (swap with upload-to-S3/R2 in production)
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const stored = await storeFile({
    documentId,
    documentLabel: documentLabel ?? documentId,
    applicationId: "", // will be linked on submit
    originalName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    content: base64,
  });

  return NextResponse.json({
    success: true,
    fileId: stored.fileId,
    documentId,
    originalName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  });
}
