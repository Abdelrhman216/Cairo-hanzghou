"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { VisaDocument } from "@/lib/visa-types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const CONTINENTS = ["All", "Asia", "Europe", "Africa", "North America", "South America", "Oceania"];

export default function AdminVisaRequirementsPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [search, setSearch] = useState("");
  const [continentFilter, setContinentFilter] = useState("All");

  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [visaTypes, setVisaTypes] = useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const [selectedVisaTypeId, setSelectedVisaTypeId] = useState<string | null>(null);
  const [visaTypeDetail, setVisaTypeDetail] = useState<any | null>(null);
  const [loadingRequirements, setLoadingRequirements] = useState(false);

  // Master document registry for "Add Document" selection
  const [masterRegistry, setMasterRegistry] = useState<VisaDocument[]>([]);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Load countries on mount
  const fetchCountries = useCallback(async () => {
    try {
      const res = await fetch("/api/visa/countries");
      const data = await res.json();
      setCountries(data.countries ?? []);
    } catch (err) {
      console.error("Failed to load countries:", err);
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Load master registry
  useEffect(() => {
    async function loadRegistry() {
      try {
        const res = await fetch("/api/visa/requirements?registry=true");
        const data = await res.json();
        setMasterRegistry(data.documents ?? []);
      } catch (err) {
        console.error("Failed to load document registry:", err);
      }
    }
    loadRegistry();
  }, []);

  // Filter countries list
  const filteredCountries = useMemo(() => {
    return countries.filter((c) => {
      const matchesSearch =
        !search ||
        c.countryName.toLowerCase().includes(search.toLowerCase()) ||
        c.countryCode.toLowerCase().includes(search.toLowerCase());
      const matchesContinent = continentFilter === "All" || c.continent === continentFilter;
      return matchesSearch && matchesContinent;
    });
  }, [countries, search, continentFilter]);

  const selectedCountry = useMemo(() => {
    return countries.find((c) => c.countryCode === selectedCountryCode);
  }, [countries, selectedCountryCode]);

  // Fetch visa types when country is clicked
  const handleCountryClick = async (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    setSelectedVisaTypeId(null);
    setVisaTypeDetail(null);
    setLoadingTypes(true);

    try {
      const res = await fetch(`/api/visa/requirements?country=${countryCode}`);
      const data = await res.json();
      setVisaTypes(data.visaTypes ?? []);
    } catch (err) {
      console.error("Failed to fetch visa types:", err);
      setVisaTypes([]);
    } finally {
      setLoadingTypes(false);
    }
  };

  // Fetch document requirements when visa type is clicked
  const handleVisaTypeClick = async (visaTypeId: string) => {
    setSelectedVisaTypeId(visaTypeId);
    setLoadingRequirements(true);
    setShowAddDropdown(false);

    try {
      const res = await fetch(
        `/api/visa/requirements?country=${selectedCountryCode}&type=${visaTypeId}`
      );
      const data = await res.json();
      setVisaTypeDetail(data);
    } catch (err) {
      console.error("Failed to fetch requirements:", err);
      setVisaTypeDetail(null);
    } finally {
      setLoadingRequirements(false);
    }
  };

  // Action: Toggle document required/optional status
  const handleToggleRequired = async (docId: string, currentRequired: boolean) => {
    if (!selectedCountryCode || !selectedVisaTypeId) return;

    try {
      const res = await fetch("/api/visa/requirements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: selectedCountryCode,
          visaTypeId: selectedVisaTypeId,
          docId,
          patch: { required: !currentRequired },
        }),
      });

      if (res.ok) {
        // Refresh local view
        setVisaTypeDetail((prev: any) => {
          if (!prev) return null;
          return {
            ...prev,
            requiredDocuments: prev.requiredDocuments.map((d: VisaDocument) =>
              d.id === docId ? { ...d, required: !currentRequired } : d
            ),
          };
        });
        // Also refresh type lists to update counts
        handleCountryClick(selectedCountryCode);
      }
    } catch (err) {
      console.error("Failed to toggle document status:", err);
    }
  };

  // Action: Delete document requirement
  const handleDeleteDocument = async (docId: string) => {
    if (!selectedCountryCode || !selectedVisaTypeId) return;

    try {
      const res = await fetch("/api/visa/requirements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: selectedCountryCode,
          visaTypeId: selectedVisaTypeId,
          docId,
        }),
      });

      if (res.ok) {
        setVisaTypeDetail((prev: any) => {
          if (!prev) return null;
          return {
            ...prev,
            requiredDocuments: prev.requiredDocuments.filter((d: VisaDocument) => d.id !== docId),
          };
        });
        handleCountryClick(selectedCountryCode);
      }
    } catch (err) {
      console.error("Failed to delete document requirement:", err);
    }
  };

  // Action: Add document requirement from master registry
  const handleAddDocument = async (doc: VisaDocument) => {
    if (!selectedCountryCode || !selectedVisaTypeId) return;

    try {
      const res = await fetch("/api/visa/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: selectedCountryCode,
          visaTypeId: selectedVisaTypeId,
          document: {
            ...doc,
            required: true, // Default to required when added
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setVisaTypeDetail((prev: any) => {
          if (!prev) return null;
          return {
            ...prev,
            requiredDocuments: [...prev.requiredDocuments, json.document],
          };
        });
        setShowAddDropdown(false);
        handleCountryClick(selectedCountryCode);
      }
    } catch (err) {
      console.error("Failed to add document requirement:", err);
    }
  };

  // Unused documents that can be added to the current visa type
  const availableRegistryDocs = useMemo(() => {
    if (!visaTypeDetail) return [];
    const existingIds = new Set(visaTypeDetail.requiredDocuments.map((d: any) => d.id));
    return masterRegistry.filter((d) => !existingIds.has(d.id));
  }, [masterRegistry, visaTypeDetail]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-caslon text-headline-lg text-deep-navy mb-1">Visa Requirements Manager</h1>
            <p className="font-jakarta text-body-md text-on-surface-variant">
              Manage document checklist rules dynamically in the backend database. Edits are immediately live.
            </p>
          </div>
          <a
            href="/admin/visa"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-sand-beige transition-colors font-jakarta text-sm font-semibold text-deep-navy"
          >
            <span className="material-symbols-outlined text-sm">assignment_ind</span>
            Back to Applications
          </a>
        </div>
      </motion.div>

      {/* Interactive explorer layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Country list */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-luxury"
        >
          <div className="p-4 border-b border-outline-variant/30">
            <h2 className="font-jakarta font-bold text-sm text-deep-navy mb-3">Countries</h2>
            <div className="relative mb-3">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-white font-jakarta text-sm focus:outline-none focus:ring-2 focus:ring-deep-navy/20"
                aria-label="Search countries"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CONTINENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setContinentFilter(c)}
                  className={cn(
                    "px-3 py-1 rounded-full font-jakarta text-xs font-semibold transition-all",
                    continentFilter === c
                      ? "bg-deep-navy text-white"
                      : "bg-outline-variant/10 text-on-surface-variant hover:bg-sand-beige"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[520px] no-scrollbar">
            {loadingCountries ? (
              <div className="py-16 text-center">
                <div className="w-6 h-6 border-2 border-deep-navy border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="font-jakarta text-xs text-on-surface-variant">Loading...</span>
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="py-16 text-center font-jakarta text-xs text-on-surface-variant">
                No countries found.
              </div>
            ) : (
              filteredCountries.map((c) => (
                <button
                  key={c.countryCode}
                  onClick={() => handleCountryClick(c.countryCode)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-outline-variant/10 hover:bg-sand-beige transition-colors flex items-center gap-3",
                    selectedCountryCode === c.countryCode && "bg-sand-beige"
                  )}
                  aria-pressed={selectedCountryCode === c.countryCode}
                >
                  <span className="text-2xl" role="img" aria-label={c.countryName}>{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-jakarta font-semibold text-sm text-deep-navy truncate">
                      {c.countryName}
                    </p>
                    <p className="font-jakarta text-xs text-on-surface-variant">
                      {c.visaTypeCount} visa type{c.visaTypeCount !== 1 ? "s" : ""} · {c.continent}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/30 text-base">
                    chevron_right
                  </span>
                </button>
              ))
            )}
          </div>
        </motion.div>

        {/* Panel 2: Visa Types */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-luxury"
        >
          <div className="p-4 border-b border-outline-variant/30">
            <h2 className="font-jakarta font-bold text-sm text-deep-navy">
              {selectedCountry ? (
                <span className="flex items-center gap-2">
                  <span>{selectedCountry.flag}</span>
                  {selectedCountry.countryName} — Categories
                </span>
              ) : (
                "Visa Categories"
              )}
            </h2>
          </div>

          <div className="overflow-y-auto max-h-[520px] no-scrollbar">
            {!selectedCountryCode ? (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3">
                  public
                </span>
                <p className="font-jakarta text-xs text-on-surface-variant">
                  Select a country to edit categories & document checklists.
                </p>
              </div>
            ) : loadingTypes ? (
              <div className="py-16 text-center">
                <div className="w-6 h-6 border-2 border-deep-navy border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="font-jakarta text-xs text-on-surface-variant">Loading types...</span>
              </div>
            ) : visaTypes.length === 0 ? (
              <div className="py-16 text-center font-jakarta text-xs text-on-surface-variant">
                No visa types configured.
              </div>
            ) : (
              visaTypes.map((vt) => (
                <button
                  key={vt.id}
                  onClick={() => handleVisaTypeClick(vt.id)}
                  className={cn(
                    "w-full text-left px-4 py-4 border-b border-outline-variant/10 hover:bg-sand-beige transition-colors",
                    selectedVisaTypeId === vt.id && "bg-sand-beige"
                  )}
                  aria-pressed={selectedVisaTypeId === vt.id}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-sand-beige flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-deep-navy text-sm">{vt.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-jakarta font-semibold text-sm text-deep-navy truncate">{vt.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-11 text-[11px] font-jakarta text-on-surface-variant">
                    <span>{vt.documentCount} document{vt.documentCount !== 1 ? "s" : ""}</span>
                    <span>·</span>
                    <span className="font-bold text-deep-navy">{vt.requiredDocumentCount} required</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>

        {/* Panel 3: Document Requirements Detail (Editable) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-luxury"
        >
          <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
            <h2 className="font-jakarta font-bold text-sm text-deep-navy">
              Checklist Rules Manager
            </h2>
            {selectedVisaTypeId && visaTypeDetail && (
              <div className="relative">
                <button
                  onClick={() => setShowAddDropdown((v) => !v)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-deep-navy text-white font-jakarta text-[11px] font-bold hover:bg-deep-navy/90"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  Add Rule
                </button>
                <AnimatePresence>
                  {showAddDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-outline-variant rounded-xl shadow-luxury z-30 max-h-[250px] overflow-y-auto pr-1"
                    >
                      {availableRegistryDocs.length === 0 ? (
                        <p className="p-3 text-xs font-jakarta italic text-on-surface-variant/60 text-center">
                          All master registry documents are already added.
                        </p>
                      ) : (
                        availableRegistryDocs.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => handleAddDocument(doc)}
                            className="w-full text-left px-3 py-2 border-b border-outline-variant/10 hover:bg-sand-beige transition-colors text-xs font-jakarta text-deep-navy flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-sm text-champagne-gold">{doc.icon}</span>
                            <span className="truncate">{doc.label}</span>
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="overflow-y-auto max-h-[520px] p-4 no-scrollbar">
            {!selectedVisaTypeId ? (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3">
                  folder_open
                </span>
                <p className="font-jakarta text-xs text-on-surface-variant">
                  Select a category to manage document checklist requirements.
                </p>
              </div>
            ) : loadingRequirements ? (
              <div className="py-16 text-center">
                <div className="w-6 h-6 border-2 border-deep-navy border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="font-jakarta text-xs text-on-surface-variant">Loading rules...</span>
              </div>
            ) : visaTypeDetail ? (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-sand-beige/40 border border-outline-variant/10">
                  <h3 className="font-caslon font-bold text-headline-sm text-deep-navy mb-1">{visaTypeDetail.visaTypeLabel}</h3>
                  <p className="font-jakarta text-xs text-on-surface-variant">{visaTypeDetail.description}</p>
                </div>

                <div className="space-y-3">
                  {visaTypeDetail.requiredDocuments.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl bg-white border border-outline-variant/35 flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-champagne-gold text-base">{doc.icon}</span>
                          <div>
                            <p className="font-jakarta font-bold text-xs text-deep-navy">{doc.label}</p>
                            <p className="font-jakarta text-[10px] text-on-surface-variant">{doc.allowedTypes.join(", ").toUpperCase()} · Max {doc.maxSizeMB}MB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="w-6 h-6 rounded hover:bg-red-50 text-red-500 flex items-center justify-center transition-all"
                          title="Remove rule"
                          aria-label={`Remove document requirement ${doc.label}`}
                        >
                          <span className="material-symbols-outlined text-xs">delete</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between border-t border-outline-variant/15 pt-2">
                        <span className="font-jakarta text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                          Validation Rules
                        </span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={doc.required}
                            onChange={() => handleToggleRequired(doc.id, doc.required)}
                            className="w-3.5 h-3.5 border-outline-variant rounded bg-white text-deep-navy accent-deep-navy"
                            aria-label={`Mark ${doc.label} as required`}
                          />
                          <span className="font-jakarta text-xs text-deep-navy font-semibold">
                            Required
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center font-jakarta text-sm text-red-500">Error loading rules</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
