"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PublicLayout from "@/components/layout/PublicLayout";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import type { VisaType, VisaDocument } from "@/lib/visa-types";
import { useTranslation } from "@/components/layout/I18nProvider";
import { getVisaCountries, getVisaRequirements, uploadVisaDocument, submitVisaApplication } from "@/services/visa";

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.25 } },
};

// ─── Constants ─────────────────────────────────────────────────────────────────

const CONTINENTS = ["All", "Asia", "Europe", "Africa", "North America", "South America", "Oceania"];

const STEPS = [
  { step: 1, label: "Destination", icon: "public" },
  { step: 2, label: "Visa Type", icon: "description" },
  { step: 3, label: "Documents", icon: "upload_file" },
  { step: 4, label: "Applicant", icon: "person" },
  { step: 5, label: "Submit", icon: "check_circle" },
];

interface UploadState {
  fileId?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploading: boolean;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <nav className="flex items-center justify-center gap-0 mb-10" aria-label="Application steps">
      {STEPS.map((s, i) => (
        <div key={s.step} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center font-jakarta font-bold text-sm transition-all duration-300",
                currentStep > s.step
                  ? "bg-champagne-gold text-deep-navy"
                  : currentStep === s.step
                  ? "bg-deep-navy text-white ring-4 ring-deep-navy/20"
                  : "bg-outline-variant/20 text-on-surface-variant"
              )}
              aria-current={currentStep === s.step ? "step" : undefined}
            >
              {currentStep > s.step ? (
                <span className="material-symbols-outlined text-base">check</span>
              ) : (
                s.step
              )}
            </div>
            <span
              className={cn(
                "font-jakarta text-xs hidden sm:block",
                currentStep === s.step ? "text-deep-navy font-semibold" : "text-on-surface-variant"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-8 sm:w-14 mx-1 transition-all duration-500",
                currentStep > s.step ? "bg-champagne-gold" : "bg-outline-variant/30"
              )}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </nav>
  );
}

function DocumentUploadCard({
  doc,
  file,
  onUpload,
  onRemove,
}: {
  doc: VisaDocument;
  file?: UploadState;
  onUpload: (docId: string, file: File) => void;
  onRemove: (docId: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const accept = doc.allowedTypes.map((t) => `.${t}`).join(",");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      // Size validation
      if (selectedFile.size > doc.maxSizeMB * 1024 * 1024) {
        alert(`File is too large. Maximum allowed size is ${doc.maxSizeMB} MB.`);
        return;
      }

      onUpload(doc.id, selectedFile);
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [doc, onUpload]
  );

  const isUploaded = !!file && !file.uploading;
  const isUploading = !!file && file.uploading;
  const fileSizeMB = file ? (file.fileSize / 1024 / 1024).toFixed(1) : null;

  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl border p-4 transition-all duration-300",
        isUploaded
          ? "border-green-300 bg-green-50"
          : isUploading
          ? "border-blue-300 bg-blue-50/50"
          : doc.required
          ? "border-outline-variant bg-white hover:border-champagne-gold hover:bg-sand-beige/30"
          : "border-dashed border-outline-variant/50 bg-white/60 hover:border-outline-variant"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
        aria-label={`Upload ${doc.label}`}
      />

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
            isUploaded ? "bg-green-100" : isUploading ? "bg-blue-100 animate-pulse" : "bg-sand-beige"
          )}
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <span
              className={cn(
                "material-symbols-outlined text-xl",
                isUploaded ? "text-green-600" : "text-deep-navy"
              )}
            >
              {isUploaded ? "check_circle" : doc.icon}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-jakarta font-semibold text-sm text-deep-navy">{doc.label}</p>
            {doc.required ? (
              <span className="px-2 py-0.5 rounded-full bg-deep-navy text-white text-xs font-jakarta font-bold">
                Required
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-outline-variant/20 text-on-surface-variant text-xs font-jakarta">
                Optional
              </span>
            )}
          </div>
          <p className="font-jakarta text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            {doc.description}
          </p>
          <p className="font-jakarta text-xs text-on-surface-variant/60 mt-1">
            {accept.toUpperCase().replace(/\./g, "")} — max {doc.maxSizeMB} MB
          </p>
          {doc.notes && (
            <p className="font-jakarta text-xs text-amber-700 mt-1 bg-amber-50 rounded-lg px-2 py-1">
              ⚠ {doc.notes}
            </p>
          )}

          {/* Uploaded file info */}
          {isUploaded && (
            <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-green-100/70">
              <span className="material-symbols-outlined text-green-600 text-sm">attach_file</span>
              <span className="font-jakarta text-xs text-green-800 truncate flex-1">
                {file.fileName}
              </span>
              <span className="font-jakarta text-xs text-green-600 whitespace-nowrap">
                {fileSizeMB} MB
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "px-3 py-1.5 rounded-xl font-jakarta font-semibold text-xs transition-all duration-200 disabled:opacity-50",
              isUploaded
                ? "bg-white border border-green-300 text-green-700 hover:bg-green-50"
                : "bg-deep-navy text-white hover:bg-deep-navy/80"
            )}
          >
            {isUploaded ? "Replace" : isUploading ? "Uploading..." : "Upload"}
          </button>
          {isUploaded && (
            <button
              type="button"
              onClick={() => onRemove(doc.id)}
              className="px-3 py-1.5 rounded-xl font-jakarta font-semibold text-xs bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all duration-200"
              aria-label={`Remove ${doc.label}`}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────────

export default function VisaClientPage() {
  const { locale, dir, t } = useTranslation();
  const isRtl = dir === "rtl";

  const [allCountries, setAllCountries] = useState<any[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Country selection
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [continentFilter, setContinentFilter] = useState("All");
  const [eVisaOnly, setEVisaOnly] = useState(false);

  // Step 2: Visa type
  const [selectedVisaType, setSelectedVisaType] = useState<VisaType | null>(null);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Step 3: Documents
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadState>>({});
  const [requiredDocs, setRequiredDocs] = useState<VisaDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // Step 4: Applicant info
  const [applicant, setApplicant] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    passportNumber: "",
    dateOfBirth: "",
    travelDate: "",
    returnDate: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 5: Submit result
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    applicationId?: string;
    message: string;
    nextSteps?: string[];
  } | null>(null);

  // Fetch country list on mount
  useEffect(() => {
    async function fetchCountries() {
      try {
        const data = await getVisaCountries(null, null, false, locale);
        setAllCountries(data.countries ?? []);
      } catch (err) {
        console.error("Failed to load countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    }
    fetchCountries();
  }, [locale]);

  // ── Country filtering ───────────────────────────────────────────────────────

  const filteredCountries = useMemo(() => {
    return allCountries.filter((c) => {
      const matchesSearch =
        !countrySearch ||
        c.countryName.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.countryCode.toLowerCase().includes(countrySearch.toLowerCase());
      const matchesContinent = continentFilter === "All" || c.continent === continentFilter;
      const matchesEVisa = !eVisaOnly || c.eVisa;
      return matchesSearch && matchesContinent && matchesEVisa;
    });
  }, [allCountries, countrySearch, continentFilter, eVisaOnly]);

  const selectedCountry = useMemo(
    () => allCountries.find((c) => c.countryCode === selectedCountryCode),
    [allCountries, selectedCountryCode]
  );

  // ── Step handlers ───────────────────────────────────────────────────────────

  const handleCountrySelect = useCallback(async (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    setSelectedVisaType(null);
    setVisaTypes([]);
    setLoadingTypes(true);

    try {
      const data = await getVisaRequirements(countryCode, null, locale);
      setVisaTypes(
        (data.visaTypes ?? []).map((vt: any) => ({
          ...vt,
          requiredDocuments: [],
        }))
      );
    } catch {
      setVisaTypes([]);
    } finally {
      setLoadingTypes(false);
    }

    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [locale]);

  const handleVisaTypeSelect = useCallback(
    async (visaTypeId: string) => {
      if (!selectedCountryCode) return;
      setLoadingDocs(true);
      setUploadedFiles({});

      try {
        const data = await getVisaRequirements(selectedCountryCode, visaTypeId, locale);
        if (!data.visaType) {
          throw new Error("Visa type not found");
        }
        const fullType: VisaType = {
          id: data.visaType.id,
          label: data.visaType.label,
          description: data.visaType.description,
          icon: data.visaType.icon || "description",
          processingTime: data.visaType.processingTime,
          governmentFee: data.visaType.governmentFee,
          maxStay: data.visaType.maxStay,
          validity: data.visaType.validity,
          eVisa: data.visaType.eVisa,
          visaOnArrival: data.visaType.visaOnArrival,
          requiredDocuments: data.requiredDocuments ?? [],
        };
        setSelectedVisaType(fullType);
        setRequiredDocs(data.requiredDocuments ?? []);
      } catch {
        setRequiredDocs([]);
      } finally {
        setLoadingDocs(false);
      }

      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [selectedCountryCode, locale]
  );

  const handleFileUpload = useCallback(async (docId: string, file: File) => {
    // 1. Mark status as uploading
    setUploadedFiles((prev) => ({
      ...prev,
      [docId]: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploading: true,
      },
    }));

    try {
      // 2. Upload file through upload API
      const data = await uploadVisaDocument(file);

      // 3. Update state with file ID
      setUploadedFiles((prev) => ({
        ...prev,
        [docId]: {
          fileId: "mock-file-id-" + Math.floor(Math.random() * 10000),
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploading: false,
        },
      }));
    } catch (err: any) {
      alert(`Upload failed: ${err.message || err}`);
      setUploadedFiles((prev) => {
        const next = { ...prev };
        delete next[docId];
        return next;
      });
    }
  }, []);

  const handleFileRemove = useCallback((docId: string) => {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  }, []);

  const handleDocumentsNext = useCallback(() => {
    // Check all required docs are uploaded
    const requiredNotUploaded = requiredDocs
      .filter((d) => d.required)
      .filter((d) => !uploadedFiles[d.id] || uploadedFiles[d.id].uploading);

    if (requiredNotUploaded.length > 0) {
      alert(
        `Please upload all required documents before continuing.\n\nMissing:\n${requiredNotUploaded.map((d) => `• ${d.label}`).join("\n")}`
      );
      return;
    }

    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [requiredDocs, uploadedFiles]);

  const handleApplicantChange = useCallback(
    (field: string, value: string) => {
      setApplicant((prev) => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [formErrors]
  );

  const validateApplicantForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!applicant.firstName.trim()) errors.firstName = "First name is required";
    if (!applicant.lastName.trim()) errors.lastName = "Last name is required";
    if (!applicant.email.trim()) errors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant.email))
      errors.email = "Please enter a valid email address";
    if (!applicant.phone.trim()) errors.phone = "Phone number is required";
    if (!applicant.passportNumber.trim()) errors.passportNumber = "Passport number is required";
    if (!applicant.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!applicant.travelDate) errors.travelDate = "Planned travel date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [applicant]);

  const handleApplicantNext = useCallback(() => {
    if (!validateApplicantForm()) return;
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [validateApplicantForm]);

  const handleSubmit = useCallback(async () => {
    if (!selectedCountryCode || !selectedVisaType) return;
    setSubmitting(true);

    try {
      const formattedDocs: Record<string, { name: string; url: string; uploadedAt: string }> = {};
      Object.entries(uploadedFiles).forEach(([docId, val]) => {
        formattedDocs[docId] = {
          name: val.fileName || "document.pdf",
          url: "#",
          uploadedAt: new Date().toISOString(),
        };
      });

      const data = await submitVisaApplication({
        countryCode: selectedCountryCode,
        visaTypeId: selectedVisaType.id,
        documents: formattedDocs,
      });

      setSubmitResult({
        success: true,
        applicationId: data.applicationId,
        message: locale === "en" ? "Application Submitted Successfully" : "تم تقديم الطلب بنجاح",
        nextSteps: [
          locale === "en" ? "Check email confirmation" : "تحقق من بريدك الإلكتروني لتأكيد الطلب",
          locale === "en" ? "Wait for status updates" : "انتظر تحديثات حالة الطلب"
        ]
      });
    } catch {
      setSubmitResult({
        success: false,
        message: "Failed to submit your application. Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }, [selectedCountryCode, selectedVisaType, uploadedFiles, locale]);

  // ── Computed values ─────────────────────────────────────────────────────────

  const uploadedCount = Object.values(uploadedFiles).filter((f) => !f.uploading).length;
  const requiredCount = requiredDocs.filter((d) => d.required).length;
  const uploadedRequiredCount = requiredDocs
    .filter((d) => d.required)
    .filter((d) => uploadedFiles[d.id] && !uploadedFiles[d.id].uploading).length;

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <PublicLayout>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-deep-navy pt-24 pb-16 lg:pt-32 lg:pb-20" aria-label="Visa center banner">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.p variants={fadeUp} custom={0} className="font-jakarta text-label-lg text-champagne-gold tracking-widest uppercase mb-3">
              {t("visa.consultancy")}
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-caslon text-display-lg-mobile md:text-headline-lg text-white mb-4">
              {t("visa.title")}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="font-jakarta text-body-lg text-white/80 max-w-xl mb-10">
              {t("visa.subtitle")}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="grid grid-cols-3 gap-6 max-w-lg">
              {[
                { value: "99.2%", label: t("visa.stats.rate") },
                { value: locale === "en" ? "3 Days" : "٣ أيام", label: t("visa.stats.avg") },
                { value: locale === "en" ? "35+" : "٣٥+", label: t("visa.stats.countries") },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-caslon text-headline-md text-champagne-gold">{s.value}</p>
                  <p className="font-jakarta text-label-sm text-white/60">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Application Flow ──────────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-16 py-12">
        <StepIndicator currentStep={currentStep} />

        <AnimatePresence mode="wait">

          {/* ── STEP 1: Country Selection ───────────────────────────────────── */}
          {currentStep === 1 && (
            <motion.div key="step1" variants={slideIn} initial="hidden" animate="visible" exit="exit">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <span className={cn("material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-on-surface-variant", isRtl ? "right-4" : "left-4")}>
                    search
                  </span>
                  <input
                    type="search"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder={t("visa.searchCountry")}
                    className={cn(
                      "w-full py-3 rounded-xl border border-outline-variant bg-white font-jakarta text-sm text-deep-navy placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-deep-navy/30 focus:border-deep-navy transition-all",
                      isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                    )}
                    aria-label="Search countries"
                  />
                </div>

                {/* e-Visa toggle */}
                <button
                  onClick={() => setEVisaOnly((v) => !v)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl font-jakarta font-semibold text-sm transition-all border",
                    eVisaOnly
                      ? "bg-deep-navy text-white border-deep-navy"
                      : "bg-white text-deep-navy border-outline-variant hover:border-champagne-gold"
                  )}
                  aria-pressed={eVisaOnly}
                >
                  <span className="material-symbols-outlined text-base">phonelink</span>
                  {t("visa.eVisaOnly")}
                </button>
              </div>

              {/* Continent filter */}
              <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by continent">
                {CONTINENTS.map((c) => {
                  const localizedContinents: Record<string, string> = {
                    All: "الكل", Asia: "آسيا", Europe: "أوروبا", Africa: "أفريقيا",
                    "North America": "أمريكا الشمالية", "South America": "أمريكا الجنوبية", Oceania: "أوقيانوسيا"
                  };
                  return (
                    <button
                      key={c}
                      onClick={() => setContinentFilter(c)}
                      className={cn(
                        "px-4 py-2 rounded-full font-jakarta font-semibold text-sm transition-all",
                        continentFilter === c
                          ? "bg-deep-navy text-white"
                          : "bg-white border border-outline-variant text-deep-navy hover:border-champagne-gold hover:bg-sand-beige"
                      )}
                      aria-pressed={continentFilter === c}
                    >
                      {locale === "en" ? c : localizedContinents[c] || c}
                    </button>
                  );
                })}
              </div>

              {/* Results count */}
              <p className={cn("font-jakarta text-sm text-on-surface-variant mb-4", isRtl && "text-right")}>
                {t("visa.showing")}{" "}
                <span className="font-bold text-deep-navy">{filteredCountries.length}</span>{" "}
                {filteredCountries.length === 1 ? t("visa.country") : t("visa.countries")}
              </p>

              {loadingCountries ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-deep-navy border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 font-jakarta text-on-surface-variant">{t("common.loading")}</span>
                </div>
              ) : filteredCountries.length === 0 ? (
                <EmptyState
                  icon="public_off"
                  title={t("visa.noCountries")}
                  description={t("visa.noCountriesDesc")}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredCountries.map((country, i) => (
                    <motion.button
                      key={country.countryCode}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={Math.min(i, 8)}
                      onClick={() => handleCountrySelect(country.countryCode)}
                      className={cn(
                        "group rounded-xl border border-outline-variant bg-white p-4 hover:border-champagne-gold hover:shadow-luxury transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-deep-navy/30",
                        isRtl ? "text-right" : "text-left"
                      )}
                      aria-label={`Select ${country.countryName}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl leading-none" role="img" aria-label={country.countryName}>
                          {country.flag}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-jakarta font-bold text-sm text-deep-navy truncate group-hover:text-champagne-gold transition-colors">
                            {country.countryName}
                          </p>
                          <p className="font-jakarta text-xs text-on-surface-variant">
                            {locale === "en" ? country.continent : (({
                              Asia: "آسيا", Europe: "أوروبا", Africa: "أفريقيا",
                              "North America": "أمريكا الشمالية", "South America": "أمريكا الجنوبية", Oceania: "أوقيانوسيا"
                            } as any)[country.continent] || country.continent)}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="font-jakarta text-xs text-on-surface-variant/60">
                              {country.visaTypeCount} {locale === "en" ? `visa type${country.visaTypeCount !== 1 ? "s" : ""}` : `أنواع تأشيرات`}
                            </span>
                            {country.eVisa && (
                              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-jakarta font-semibold">
                                {locale === "en" ? "e-Visa" : "تأشيرة إلكترونية"}
                              </span>
                            )}
                            {country.visaOnArrival && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-jakarta font-semibold">
                                {locale === "en" ? "On Arrival" : "عند الوصول"}
                              </span>
                            )}
                            {country.visaFreeForEgyptian && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-jakarta font-semibold">
                                {locale === "en" ? "Visa Free 🇪🇬" : "بدون تأشيرة 🇪🇬"}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={cn("material-symbols-outlined text-on-surface-variant/30 group-hover:text-champagne-gold transition-colors mt-1", isRtl && "rotate-180")}>
                          arrow_forward
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 2: Visa Type Selection ─────────────────────────────────── */}
          {currentStep === 2 && (
            <motion.div key="step2" variants={slideIn} initial="hidden" animate="visible" exit="exit">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 font-jakarta font-semibold text-sm text-on-surface-variant hover:text-deep-navy transition-colors mb-6"
              >
                <span className={cn("material-symbols-outlined text-base", isRtl && "rotate-180")}>arrow_back</span>
                {t("visa.backToCountries")}
              </button>

              {selectedCountry && (
                <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-sand-beige border border-champagne-gold/20">
                  <span className="text-4xl">{selectedCountry.flag}</span>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <p className="font-caslon text-headline-md text-deep-navy">{selectedCountry.countryName}</p>
                    <p className="font-jakarta text-sm text-on-surface-variant">
                      {locale === "en" ? selectedCountry.continent : (({
                        Asia: "آسيا", Europe: "أوروبا", Africa: "أفريقيا",
                        "North America": "أمريكا الشمالية", "South America": "أمريكا الجنوبية", Oceania: "أوقيانوسيا"
                      } as any)[selectedCountry.continent] || selectedCountry.continent)} · {selectedCountry.capital}
                    </p>
                  </div>
                </div>
              )}

              <h2 className={cn("font-caslon text-headline-lg text-deep-navy mb-2", isRtl && "text-right")}>
                {t("visa.selectVisaType")}
              </h2>
              <p className={cn("font-jakarta text-body-md text-on-surface-variant mb-8", isRtl && "text-right")}>
                {t("visa.selectVisaTypeDesc")}
              </p>

              {loadingTypes ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-deep-navy border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 font-jakarta text-on-surface-variant">{t("common.loading")}</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visaTypes.map((vt, i) => (
                    <motion.button
                      key={vt.id}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      onClick={() => handleVisaTypeSelect(vt.id)}
                      className={cn(
                        "group rounded-xl border border-outline-variant bg-white p-6 hover:border-champagne-gold hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-deep-navy/30",
                        isRtl ? "text-right" : "text-left"
                      )}
                      aria-label={`Select ${vt.label}`}
                    >
                      <div className={cn("w-12 h-12 rounded-xl bg-sand-beige flex items-center justify-center mb-4 group-hover:bg-champagne-gold/20 transition-colors", isRtl && "mr-0 ml-auto")}>
                        <span className="material-symbols-outlined text-deep-navy text-2xl">
                          {vt.icon}
                        </span>
                      </div>
                      <h3 className="font-caslon text-headline-md text-deep-navy mb-2 group-hover:text-champagne-gold transition-colors">
                        {vt.label}
                      </h3>
                      <p className="font-jakarta text-body-sm text-on-surface-variant mb-4 line-clamp-2">
                        {vt.description}
                      </p>
                      <div className="space-y-1.5 border-t border-outline-variant/20 pt-4">
                        {[
                          { icon: "schedule", label: vt.processingTime },
                          { icon: "payments", label: vt.governmentFee ?? (locale === "en" ? "Varies" : "متغير") },
                          { icon: "calendar_today", label: vt.maxStay ?? (locale === "en" ? "Varies" : "متغير") },
                        ].map((info) => (
                          <div key={info.icon} className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-champagne-gold text-sm mt-0.5">{info.icon}</span>
                            <span className="font-jakarta text-xs text-on-surface-variant">{info.label}</span>
                          </div>
                        ))}
                        <div className={cn("flex gap-2 mt-2", isRtl && "justify-start")}>
                          {vt.eVisa && (
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-jakarta font-semibold">
                              {locale === "en" ? "e-Visa" : "تأشيرة إلكترونية"}
                            </span>
                          )}
                          {vt.visaOnArrival && (
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-jakarta font-semibold">
                              {locale === "en" ? "On Arrival" : "عند الوصول"}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 3: Document Upload ─────────────────────────────────────── */}
          {currentStep === 3 && (
            <motion.div key="step3" variants={slideIn} initial="hidden" animate="visible" exit="exit">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 font-jakarta font-semibold text-sm text-on-surface-variant hover:text-deep-navy transition-colors mb-6"
              >
                <span className={cn("material-symbols-outlined text-base", isRtl && "rotate-180")}>arrow_back</span>
                {t("visa.backToVisaTypes")}
              </button>

              {/* Selection summary */}
              {selectedCountry && selectedVisaType && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 p-4 rounded-xl bg-sand-beige border border-champagne-gold/20">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedCountry.flag}</span>
                    <div className={isRtl ? "text-right" : "text-left"}>
                      <p className="font-jakarta font-bold text-sm text-deep-navy">
                        {selectedCountry.countryName} — {selectedVisaType.label}
                      </p>
                      <p className="font-jakarta text-xs text-on-surface-variant">
                        {selectedVisaType.processingTime} · {selectedVisaType.governmentFee}
                      </p>
                    </div>
                  </div>
                  {/* Upload progress */}
                  <div className={cn("flex items-center gap-3", isRtl ? "sm:mr-auto sm:ml-0" : "sm:ml-auto sm:mr-0")}>
                    <div className="w-32 h-2 rounded-full bg-outline-variant/20 overflow-hidden">
                      <div
                        className="h-full bg-champagne-gold rounded-full transition-all duration-500"
                        style={{ width: requiredCount > 0 ? `${(uploadedRequiredCount / requiredCount) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="font-jakarta text-sm font-semibold text-deep-navy whitespace-nowrap">
                      {locale === "en" ? `${uploadedRequiredCount}/${requiredCount} required` : `${uploadedRequiredCount} من ${requiredCount} مطلوب`}
                    </span>
                  </div>
                </div>
              )}

              <h2 className={cn("font-caslon text-headline-lg text-deep-navy mb-2", isRtl && "text-right")}>
                {t("visa.uploadDocs")}
              </h2>
              <p className={cn("font-jakarta text-body-md text-on-surface-variant mb-8", isRtl && "text-right")}>
                {locale === "en"
                  ? `Each document requirement is fetched directly from the database for the ${selectedCountry?.countryName} ${selectedVisaType?.label}.`
                  : `يتم جلب متطلبات كل مستند مباشرة من قاعدة البيانات لدولة ${selectedCountry?.countryName} - ${selectedVisaType?.label}.`}
              </p>

              {loadingDocs ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-deep-navy border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 font-jakarta text-on-surface-variant">{t("common.loading")}</span>
                </div>
              ) : requiredDocs.length === 0 ? (
                <EmptyState icon="folder_open" title={t("visa.noDocs")} description={t("visa.noDocsDesc")} />
              ) : (
                <>
                  {/* Required documents section */}
                  {requiredDocs.filter((d) => d.required).length > 0 && (
                    <div className="mb-6">
                      <h3 className={cn("font-jakarta font-bold text-sm text-deep-navy uppercase tracking-widest mb-3 flex items-center gap-2", isRtl && "flex-row-reverse")}>
                        <span className="material-symbols-outlined text-base text-champagne-gold">priority_high</span>
                        {t("visa.requiredDocs")} ({requiredDocs.filter((d) => d.required).length})
                      </h3>
                      <div className="space-y-3">
                        {requiredDocs
                          .filter((d) => d.required)
                          .map((doc) => (
                            <DocumentUploadCard
                              key={doc.id}
                              doc={doc}
                              file={uploadedFiles[doc.id]}
                              onUpload={handleFileUpload}
                              onRemove={handleFileRemove}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Optional documents section */}
                  {requiredDocs.filter((d) => !d.required).length > 0 && (
                    <div className="mb-8">
                      <h3 className={cn("font-jakarta font-bold text-sm text-on-surface-variant uppercase tracking-widest mb-3 flex items-center gap-2", isRtl && "flex-row-reverse")}>
                        <span className="material-symbols-outlined text-base">add_circle</span>
                        {t("visa.optionalDocs")} ({requiredDocs.filter((d) => !d.required).length})
                      </h3>
                      <div className="space-y-3">
                        {requiredDocs
                          .filter((d) => !d.required)
                          .map((doc) => (
                            <DocumentUploadCard
                              key={doc.id}
                              doc={doc}
                              file={uploadedFiles[doc.id]}
                              onUpload={handleFileUpload}
                              onRemove={handleFileRemove}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                    <p className="font-jakarta text-sm text-on-surface-variant">
                      {locale === "en" ? `${uploadedCount} file${uploadedCount !== 1 ? "s" : ""} uploaded` : `تم رفع ${uploadedCount} مستندات`}
                    </p>
                    <button
                      onClick={handleDocumentsNext}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl bg-deep-navy text-white font-jakarta font-bold text-sm hover:bg-deep-navy/80 transition-all duration-200 hover:shadow-luxury"
                    >
                      {t("visa.continueToApplicant")}
                      <span className={cn("material-symbols-outlined text-base", isRtl && "rotate-180")}>arrow_forward</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── STEP 4: Applicant Information ──────────────────────────────── */}
          {currentStep === 4 && (
            <motion.div key="step4" variants={slideIn} initial="hidden" animate="visible" exit="exit">
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 font-jakarta font-semibold text-sm text-on-surface-variant hover:text-deep-navy transition-colors mb-6"
              >
                <span className={cn("material-symbols-outlined text-base", isRtl && "rotate-180")}>arrow_back</span>
                {t("visa.backToDocs")}
              </button>

              <h2 className={cn("font-caslon text-headline-lg text-deep-navy mb-2", isRtl && "text-right")}>{t("visa.applicantInfo")}</h2>
              <p className={cn("font-jakarta text-body-md text-on-surface-variant mb-8", isRtl && "text-right")}>
                {t("visa.applicantInfoDesc")}
              </p>

              <div className="max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { field: "firstName", label: t("visa.fields.firstName"), placeholder: t("visa.placeholders.firstName"), type: "text" },
                    { field: "lastName", label: t("visa.fields.lastName"), placeholder: t("visa.placeholders.lastName"), type: "text" },
                    { field: "email", label: t("visa.fields.email"), placeholder: t("visa.placeholders.email"), type: "email" },
                    { field: "phone", label: t("visa.fields.phone"), placeholder: t("visa.placeholders.phone"), type: "tel" },
                    { field: "nationality", label: t("visa.fields.nationality"), placeholder: t("visa.placeholders.nationality"), type: "text" },
                    { field: "passportNumber", label: t("visa.fields.passportNumber"), placeholder: t("visa.placeholders.passportNumber"), type: "text" },
                    { field: "dateOfBirth", label: t("visa.fields.dateOfBirth"), placeholder: "", type: "date" },
                    { field: "travelDate", label: t("visa.fields.travelDate"), placeholder: "", type: "date" },
                    { field: "returnDate", label: t("visa.fields.returnDate"), placeholder: "", type: "date" },
                  ].map(({ field, label, placeholder, type }) => (
                    <div key={field} className={cn(field === "email" || field === "returnDate" ? "sm:col-span-2" : "", isRtl ? "text-right" : "text-left")}>
                      <label
                        htmlFor={`applicant-${field}`}
                        className="block font-jakarta font-semibold text-sm text-deep-navy mb-1.5"
                      >
                        {label}
                        {field !== "returnDate" && (
                          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                        )}
                      </label>
                      <input
                        id={`applicant-${field}`}
                        type={type}
                        value={applicant[field as keyof typeof applicant]}
                        onChange={(e) => handleApplicantChange(field, e.target.value)}
                        placeholder={placeholder}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border font-jakarta text-sm text-deep-navy placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 transition-all",
                          isRtl ? "text-right" : "text-left",
                          formErrors[field]
                            ? "border-red-400 focus:ring-red-300 bg-red-50"
                            : "border-outline-variant bg-white focus:ring-deep-navy/30 focus:border-deep-navy"
                        )}
                        aria-required={field !== "returnDate"}
                        aria-describedby={formErrors[field] ? `${field}-error` : undefined}
                        aria-invalid={!!formErrors[field]}
                      />
                      {formErrors[field] && (
                        <p id={`${field}-error`} className="font-jakarta text-xs text-red-600 mt-1" role="alert">
                          {locale === "en" ? formErrors[field] : (
                            formErrors[field].includes("required") 
                              ? "هذا الحقل مطلوب" 
                              : "يرجى إدخال عنوان بريد إلكتروني صحيح"
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleApplicantNext}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-deep-navy text-white font-jakarta font-bold text-sm hover:bg-deep-navy/80 transition-all duration-200 hover:shadow-luxury"
                >
                  {t("visa.reviewSubmitBtn")}
                  <span className={cn("material-symbols-outlined text-base", isRtl && "rotate-180")}>arrow_forward</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 5: Review & Submit ─────────────────────────────────────── */}
          {currentStep === 5 && !submitResult && (
            <motion.div key="step5" variants={slideIn} initial="hidden" animate="visible" exit="exit">
              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-2 font-jakarta font-semibold text-sm text-on-surface-variant hover:text-deep-navy transition-colors mb-6"
              >
                <span className={cn("material-symbols-outlined text-base", isRtl && "rotate-180")}>arrow_back</span>
                {t("visa.backToApplicant")}
              </button>

              <h2 className={cn("font-caslon text-headline-lg text-deep-navy mb-2", isRtl && "text-right")}>
                {t("visa.reviewTitle")}
              </h2>
              <p className={cn("font-jakarta text-body-md text-on-surface-variant mb-8", isRtl && "text-right")}>
                {t("visa.reviewDesc")}
              </p>

              <div className="max-w-2xl space-y-6">
                {/* Visa details */}
                <div className="rounded-xl border border-outline-variant bg-white p-6">
                  <h3 className={cn("font-jakarta font-bold text-sm text-on-surface-variant uppercase tracking-widest mb-4", isRtl && "text-right")}>
                    {t("visa.reviewVisa")}
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: locale === "en" ? "Destination" : "الوجهة", value: `${selectedCountry?.flag} ${selectedCountry?.countryName}` },
                      { label: locale === "en" ? "Visa Type" : "نوع التأشيرة", value: selectedVisaType?.label ?? "" },
                      { label: locale === "en" ? "Processing Time" : "مدة المعالجة", value: selectedVisaType?.processingTime ?? "" },
                      { label: locale === "en" ? "Government Fee" : "الرسوم الحكومية", value: selectedVisaType?.governmentFee ?? (locale === "en" ? "Varies" : "متغير") },
                      { label: locale === "en" ? "Max Stay" : "أقصى مدة إقامة", value: selectedVisaType?.maxStay ?? (locale === "en" ? "Varies" : "متغير") },
                    ].map(({ label, value }) => (
                      <div key={label} className={cn("flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0", isRtl && "flex-row-reverse")}>
                        <span className="font-jakarta text-sm text-on-surface-variant">{label}</span>
                        <span className="font-jakarta font-semibold text-sm text-deep-navy">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applicant details */}
                <div className="rounded-xl border border-outline-variant bg-white p-6">
                  <h3 className={cn("font-jakarta font-bold text-sm text-on-surface-variant uppercase tracking-widest mb-4", isRtl && "text-right")}>
                    {t("visa.reviewApplicant")}
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: locale === "en" ? "Full Name" : "الاسم بالكامل", value: `${applicant.firstName} ${applicant.lastName}` },
                      { label: locale === "en" ? "Email" : "البريد الإلكتروني", value: applicant.email },
                      { label: locale === "en" ? "Phone" : "الهاتف", value: applicant.phone },
                      { label: locale === "en" ? "Nationality" : "الجنسية", value: applicant.nationality },
                      { label: locale === "en" ? "Passport No." : "رقم جواز السفر", value: applicant.passportNumber },
                      { label: locale === "en" ? "Date of Birth" : "تاريخ الميلاد", value: applicant.dateOfBirth },
                      { label: locale === "en" ? "Travel Date" : "تاريخ السفر المخطط", value: applicant.travelDate },
                      applicant.returnDate ? { label: locale === "en" ? "Return Date" : "تاريخ العودة", value: applicant.returnDate } : null,
                    ]
                      .filter(Boolean)
                      .map((item) => (
                        <div key={item!.label} className={cn("flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0", isRtl && "flex-row-reverse")}>
                          <span className="font-jakarta text-sm text-on-surface-variant">{item!.label}</span>
                          <span className="font-jakarta font-semibold text-sm text-deep-navy">{item!.value}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="rounded-xl border border-outline-variant bg-white p-6">
                  <h3 className={cn("font-jakarta font-bold text-sm text-on-surface-variant uppercase tracking-widest mb-4", isRtl && "text-right")}>
                    {locale === "en" ? `Uploaded Documents (${uploadedCount})` : `المستندات المرفوعة (${uploadedCount})`}
                  </h3>
                  <div className="space-y-2">
                    {Object.values(uploadedFiles).map((file) => (
                      <div key={file.fileId} className={cn("flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200", isRtl && "flex-row-reverse")}>
                        <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                        <span className={cn("font-jakarta text-sm text-green-800 flex-1 truncate", isRtl ? "text-right" : "text-left")}>{file.fileName}</span>
                        <span className="font-jakarta text-xs text-green-600">
                          {(file.fileSize / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-champagne-gold text-deep-navy font-jakarta font-bold text-base hover:bg-champagne-gold/80 transition-all duration-200 hover:shadow-luxury disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-deep-navy border-t-transparent rounded-full animate-spin" />
                      {locale === "en" ? "Submitting Application..." : "جاري إرسال الطلب..."}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      {t("visa.submitBtn")}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── SUCCESS STATE ───────────────────────────────────────────────── */}
          {currentStep === 5 && submitResult && (
            <motion.div
              key="success"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="max-w-2xl mx-auto text-center py-16"
            >
              <div
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6",
                  submitResult.success ? "bg-green-100" : "bg-red-100"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-5xl",
                    submitResult.success ? "text-green-600" : "text-red-600"
                  )}
                >
                  {submitResult.success ? "check_circle" : "error"}
                </span>
              </div>

              {submitResult.success ? (
                <>
                  <h2 className="font-caslon text-headline-lg text-deep-navy mb-3">
                    {t("visa.submitted")}
                  </h2>
                  <p className="font-jakarta text-body-lg text-on-surface-variant mb-2">
                    {submitResult.message}
                  </p>
                  {submitResult.applicationId && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-champagne-gold/20 border border-champagne-gold/40 mb-8">
                      <span className="material-symbols-outlined text-champagne-gold text-sm">tag</span>
                      <span className="font-jakarta font-bold text-deep-navy text-sm">
                        {locale === "en" ? "Reference ID: " : "رقم مرجع الطلب: "}{submitResult.applicationId}
                      </span>
                    </div>
                  )}

                  {submitResult.nextSteps && (
                    <div className={cn("space-y-3 mb-10 p-6 rounded-xl bg-sand-beige border border-champagne-gold/20", isRtl ? "text-right" : "text-left")}>
                      <h3 className="font-jakarta font-bold text-sm text-deep-navy uppercase tracking-widest mb-3">
                        {locale === "en" ? "Next Steps" : "الخطوات القادمة"}
                      </h3>
                      {submitResult.nextSteps.map((step, i) => (
                        <div key={i} className={cn("flex items-start gap-3", isRtl && "flex-row-reverse")}>
                          <div className="w-6 h-6 rounded-full bg-deep-navy text-white flex items-center justify-center font-jakarta font-bold text-xs flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="font-jakarta text-sm text-on-surface-variant flex-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setSelectedCountryCode(null);
                        setSelectedVisaType(null);
                        setUploadedFiles({});
                        setApplicant({
                          firstName: "", lastName: "", email: "", phone: "",
                          nationality: "", passportNumber: "", dateOfBirth: "",
                          travelDate: "", returnDate: "",
                        });
                        setSubmitResult(null);
                      }}
                      className="px-6 py-3 rounded-xl border border-outline-variant text-deep-navy font-jakarta font-semibold text-sm hover:bg-sand-beige transition-all"
                    >
                      {t("visa.newApp")}
                    </button>
                    <a
                      href="/profile"
                      className="px-6 py-3 rounded-xl bg-deep-navy text-white font-jakarta font-semibold text-sm hover:bg-deep-navy/80 transition-all text-center"
                    >
                      {t("visa.viewApps")}
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-caslon text-headline-lg text-deep-navy mb-3">
                    {locale === "en" ? "Submission Failed" : "فشل تقديم الطلب"}
                  </h2>
                  <p className="font-jakarta text-body-md text-on-surface-variant mb-6">{submitResult.message}</p>
                  <button
                    onClick={() => setSubmitResult(null)}
                    className="px-8 py-3 rounded-xl bg-deep-navy text-white font-jakarta font-bold text-sm hover:bg-deep-navy/80 transition-all"
                  >
                    {locale === "en" ? "Try Again" : "حاول مرة أخرى"}
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────────── */}
      {currentStep === 1 && (
        <section className="max-w-[1280px] mx-auto px-5 lg:px-16 pb-20" aria-label="Visa process steps">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <h2 className="font-caslon text-headline-lg text-deep-navy mb-10 text-center">
              {t("visa.howItWorks")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { step: "01", icon: "public", title: locale === "en" ? "Select Country" : "اختر الدولة", desc: locale === "en" ? "Pick your destination from 35+ countries with real visa requirements" : "اختر وجهة سفرك من بين أكثر من 35 دولة بمتطلبات حقيقية" },
                { step: "02", icon: "description", title: locale === "en" ? "Choose Visa Type" : "اختر نوع التأشيرة", desc: locale === "en" ? "Select from country-specific visa categories with exact requirements" : "اختر فئة التأشيرة المناسبة لغرض سفرك بمتطلباتها الدقيقة" },
                { step: "03", icon: "upload_file", title: locale === "en" ? "Upload Documents" : "ارفع المستندات", desc: locale === "en" ? "Upload only the documents required for your specific visa type" : "قم برفع الملفات والأوراق المطلوبة لنوع تأشيرتك المحددة" },
                { step: "04", icon: "person", title: locale === "en" ? "Applicant Info" : "بيانات مقدم الطلب", desc: locale === "en" ? "Enter your personal and passport details accurately" : "أدخل بياناتك الشخصية وبيانات جواز سفرك بدقة" },
                { step: "05", icon: "check_circle", title: locale === "en" ? "Submit & Track" : "إرسال ومتابعة", desc: locale === "en" ? "Receive your Reference ID and track your application status" : "احصل على رقم مرجع طلبك وتابع حالة معاملتك مباشرة" },
              ].map((s, i) => (
                <motion.div key={s.step} variants={fadeUp} custom={i} className="relative text-center">
                  {i < 4 && (
                    <div className={cn("hidden lg:block absolute top-7 w-full h-px bg-outline-variant/50 z-0", isRtl ? "right-full" : "left-full")} aria-hidden="true" />
                  )}
                  <div className="bg-white rounded-xl p-6 shadow-luxury relative z-10 hover:shadow-luxury-md transition-all duration-300 border border-outline-variant/10">
                    <div className="w-12 h-12 rounded-xl bg-deep-navy flex items-center justify-center mb-3 mx-auto">
                      <span className="material-symbols-outlined text-champagne-gold text-xl">{s.icon}</span>
                    </div>
                    <p className="font-caslon text-champagne-gold text-sm mb-1">{s.step}</p>
                    <h3 className="font-caslon text-headline-sm text-deep-navy mb-2">{s.title}</h3>
                    <p className="font-jakarta text-body-sm text-on-surface-variant text-sm">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </PublicLayout>
  );
}
