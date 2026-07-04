/**
 * Visa System — TypeScript Interfaces
 * Mirrors a production PostgreSQL schema so API-level swap-in is trivial.
 */

// ─── Document Definition ────────────────────────────────────────────────────

export type DocumentFileType = "pdf" | "jpg" | "jpeg" | "png" | "doc" | "docx";

export interface VisaDocument {
  /** Unique identifier e.g. "passport", "bank_statement" */
  id: string;
  /** Display label */
  label: string;
  /** Detailed description shown to the applicant */
  description: string;
  /** Material Symbols icon name */
  icon: string;
  /** Whether this document is mandatory or optional */
  required: boolean;
  /** Accepted file formats */
  allowedTypes: DocumentFileType[];
  /** Maximum file size in megabytes */
  maxSizeMB: number;
  /** Whether multiple files can be uploaded for this document */
  multiple?: boolean;
  /** Extra guidance note */
  notes?: string;
  /** Optional sample file URL */
  sampleUrl?: string;
}

// ─── Visa Type Definition ────────────────────────────────────────────────────

export interface VisaType {
  /** Unique ID e.g. "tourist", "b1_b2", "f1" */
  id: string;
  /** Display label e.g. "Tourist Visa", "B1/B2 Visitor Visa" */
  label: string;
  /** Short description */
  description: string;
  /** Material Symbols icon name */
  icon: string;
  /** Typical processing time */
  processingTime: string;
  /** Government / embassy fee */
  governmentFee?: string;
  /** Maximum stay allowed */
  maxStay?: string;
  /** Validity period */
  validity?: string;
  /** Whether this visa is e-Visa eligible */
  eVisa?: boolean;
  /** Whether visa-on-arrival is available */
  visaOnArrival?: boolean;
  /** Required documents for this specific visa type */
  requiredDocuments: VisaDocument[];
}

// ─── Country Visa Profile ────────────────────────────────────────────────────

export interface CountryVisaProfile {
  /** ISO 3166-1 alpha-2 country code e.g. "US", "DE" */
  countryCode: string;
  /** Full country name */
  countryName: string;
  /** Flag emoji */
  flag: string;
  /** Continent */
  continent: string;
  /** Capital city */
  capital: string;
  /** Visa-free for Egyptian passport holders */
  visaFreeForEgyptian?: boolean;
  /** General embassy / consulate website */
  embassyUrl?: string;
  /** Currency */
  currency?: string;
  /** Available visa categories for this country */
  visaTypes: VisaType[];
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface VisaCountrySummary {
  countryCode: string;
  countryName: string;
  flag: string;
  continent: string;
  capital: string;
  visaTypeIds: string[];
  visaTypeLabels: string[];
  processingTime: string;
  eVisa: boolean;
  visaOnArrival: boolean;
}

export interface VisaRequirementsResponse {
  countryCode: string;
  countryName: string;
  flag: string;
  visaTypeId: string;
  visaTypeLabel: string;
  description: string;
  processingTime: string;
  governmentFee?: string;
  maxStay?: string;
  validity?: string;
  eVisa: boolean;
  visaOnArrival: boolean;
  embassyUrl?: string;
  requiredDocuments: VisaDocument[];
}

// ─── Application Submission ──────────────────────────────────────────────────

export interface UploadedFile {
  documentId: string;
  documentLabel: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  /** Data URL for preview (browser only) */
  previewUrl?: string;
}

export interface VisaApplicationPayload {
  /** Destination country code */
  countryCode: string;
  /** Selected visa type id */
  visaTypeId: string;
  /** Applicant personal info */
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality: string;
    passportNumber: string;
    dateOfBirth: string;
    travelDate?: string;
    returnDate?: string;
  };
  /** Uploaded documents */
  documents: UploadedFile[];
  /** Additional notes */
  notes?: string;
}

export interface VisaApplicationResult {
  success: boolean;
  requestId?: string;
  message: string;
  estimatedProcessingDays?: number;
}
