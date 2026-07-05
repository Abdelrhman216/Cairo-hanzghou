"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { getVisaApplications, getVisaApplication, updateVisaApplicationStatus, assignVisaApplication, addVisaApplicationNote } from "@/services/visa";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const EMPLOYEES = ["Ahmed Youssef", "Sarah Mansour", "Li Wei", "Nadia Hassan"];
const STATUSES = ["Pending", "Under Review", "Documents Required", "Approved", "Rejected", "Completed"];

const STATUS_STYLES: Record<string, string> = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Rejected: "bg-red-100 text-red-700",
  "Documents Required": "bg-orange-100 text-orange-700",
  Completed: "bg-purple-100 text-purple-700",
};

export default function VisaDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Fetch applications list
  const fetchApplications = useCallback(async () => {
    try {
      let data = await getVisaApplications();
      if (statusFilter !== "All") {
        data = data.filter((a: any) => {
          let mappedStatus = a.status.toLowerCase();
          if (mappedStatus === "reviewing") mappedStatus = "under review";
          return mappedStatus === statusFilter.toLowerCase();
        });
      }
      if (search) {
        const s = search.toLowerCase();
        data = data.filter((a: any) =>
          a.userName.toLowerCase().includes(s) ||
          a.userEmail.toLowerCase().includes(s) ||
          a.id.toLowerCase().includes(s) ||
          a.countryCode.toLowerCase().includes(s)
        );
      }
      setApplications(data);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    fetchApplications();
  }, [fetchApplications]);

  // Fetch application detail when selected
  useEffect(() => {
    if (!selectedId) {
      setDetailData(null);
      return;
    }

    const appId = selectedId;

    async function fetchDetail() {
      setLoadingDetail(true);
      try {
        const data = await getVisaApplication(appId);
        setDetailData(data);
      } catch (err) {
        console.error("Failed to fetch application detail:", err);
        setDetailData(null);
      } finally {
        setLoadingDetail(false);
      }
    }

    fetchDetail();
  }, [selectedId]);

  // Action: Status update
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedId) return;
    try {
      let statusKey = newStatus.toLowerCase() as any;
      if (statusKey === "under review") statusKey = "reviewing";
      if (statusKey === "pending") statusKey = "pending";

      await updateVisaApplicationStatus(selectedId, statusKey);
      const updated = await getVisaApplication(selectedId);
      setDetailData(updated);
      fetchApplications();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Action: Assign Employee
  const handleAssign = async (employee: string) => {
    if (!selectedId) return;
    try {
      await assignVisaApplication(selectedId, employee);
      const updated = await getVisaApplication(selectedId);
      setDetailData(updated);
      fetchApplications();
    } catch (err) {
      console.error("Failed to assign:", err);
    }
  };

  // Action: Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !noteContent.trim()) return;
    setSubmittingNote(true);

    try {
      await addVisaApplicationNote(selectedId, noteContent, "Admin Manager");
      setNoteContent("");
      const updated = await getVisaApplication(selectedId);
      setDetailData(updated);
      fetchApplications();
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setSubmittingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-caslon text-headline-lg text-deep-navy mb-1">Visa Applications Portal</h1>
            <p className="font-jakarta text-body-md text-on-surface-variant">
              Process applications, manage status, assign agents, and review submitted files.
            </p>
          </div>
          <a
            href="/admin/visa/requirements"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-sand-beige transition-colors font-jakarta text-sm font-semibold text-deep-navy"
          >
            <span className="material-symbols-outlined text-sm">public</span>
            Visa Requirements DB
          </a>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Applications List (Col-Span 2) */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-outline-variant p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, name, passport or destination..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-white font-jakarta text-sm focus:outline-none focus:ring-2 focus:ring-deep-navy/20"
                aria-label="Search applications"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
              {["All", ...STATUSES].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-3 py-1.5 rounded-full font-jakarta text-xs font-semibold whitespace-nowrap transition-all",
                    statusFilter === st
                      ? "bg-deep-navy text-white"
                      : "bg-outline-variant/10 text-on-surface-variant hover:bg-sand-beige"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-luxury">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-sand-beige/10">
                    {["Ref ID", "Applicant", "Destination & Type", "Submitted", "Assigned To", "Status", "Action"].map((h) => (
                      <th
                        key={h}
                        className="text-left font-jakarta font-bold text-xs text-on-surface-variant uppercase tracking-widest px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="w-8 h-8 border-2 border-deep-navy border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <span className="font-jakarta text-sm text-on-surface-variant">Loading applications...</span>
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16">
                        <EmptyState icon="folder_open" title="No applications found" description="No visa requests fit your search criteria." />
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => setSelectedId(app.id)}
                        className={cn(
                          "border-b border-outline-variant/10 hover:bg-sand-beige/20 transition-colors cursor-pointer",
                          selectedId === app.id && "bg-sand-beige/30"
                        )}
                      >
                        <td className="px-4 py-4 font-jakarta font-bold text-xs text-champagne-gold whitespace-nowrap">
                          {app.id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="font-jakarta font-semibold text-sm text-deep-navy">
                            {app.applicantName}
                          </p>
                          <p className="font-jakarta text-xs text-on-surface-variant">
                            {app.applicantEmail}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg">{app.countryFlag}</span>
                            <p className="font-jakarta font-semibold text-sm text-deep-navy truncate max-w-[150px]">
                              {app.countryName}
                            </p>
                          </div>
                          <p className="font-jakarta text-xs text-on-surface-variant truncate max-w-[150px]">
                            {app.visaTypeLabel}
                          </p>
                        </td>
                        <td className="px-4 py-4 font-jakarta text-xs text-on-surface-variant whitespace-nowrap">
                          {new Date(app.submittedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-4 font-jakarta text-sm text-deep-navy whitespace-nowrap">
                          {app.assignedTo ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold" />
                              {app.assignedTo}
                            </span>
                          ) : (
                            <span className="text-on-surface-variant/40 text-xs italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[11px] font-jakarta font-bold whitespace-nowrap",
                              STATUS_STYLES[app.status] ?? "bg-gray-100 text-gray-600"
                            )}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(app.id);
                            }}
                            className="text-deep-navy hover:text-champagne-gold transition-colors font-jakarta text-xs font-bold"
                          >
                            Process
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Application Details Panel (Col-Span 1) */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-luxury sticky top-24 min-h-[500px]">
          {!selectedId ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3">
                assignment_ind
              </span>
              <p className="font-jakarta text-sm text-on-surface-variant">
                Select an application from the table to process and view documents.
              </p>
            </div>
          ) : loadingDetail ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-deep-navy border-t-transparent rounded-full animate-spin mb-2" />
              <span className="font-jakarta text-sm text-on-surface-variant">Loading details...</span>
            </div>
          ) : detailData ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-outline-variant/20 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-jakarta font-bold text-xs text-champagne-gold">{detailData.id}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-jakarta font-bold",
                        STATUS_STYLES[detailData.status] ?? "bg-gray-100"
                      )}
                    >
                      {detailData.status}
                    </span>
                  </div>
                  <h2 className="font-caslon text-headline-sm text-deep-navy mt-1">
                    {detailData.applicant.firstName} {detailData.applicant.lastName}
                  </h2>
                  <p className="font-jakarta text-xs text-on-surface-variant">
                    {detailData.applicant.email} · {detailData.applicant.phone}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-8 h-8 rounded-full bg-outline-variant/10 hover:bg-outline-variant/20 flex items-center justify-center text-on-surface-variant transition-colors"
                  aria-label="Close details"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {/* Status & Assignee Editors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="detail-status" className="block font-jakarta font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                    Update Status
                  </label>
                  <select
                    id="detail-status"
                    value={detailData.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full p-2 border border-outline-variant rounded-xl bg-white font-jakarta text-xs text-deep-navy focus:outline-none"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="detail-assign" className="block font-jakarta font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                    Assign Agent
                  </label>
                  <select
                    id="detail-assign"
                    value={detailData.assignedTo}
                    onChange={(e) => handleAssign(e.target.value)}
                    className="w-full p-2 border border-outline-variant rounded-xl bg-white font-jakarta text-xs text-deep-navy focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {EMPLOYEES.map((emp) => (
                      <option key={emp} value={emp}>
                        {emp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Info Details */}
              <div className="space-y-2 border-t border-b border-outline-variant/10 py-4">
                {[
                  { label: "Destination", value: `${detailData.countryFlag} ${detailData.countryName}` },
                  { label: "Visa Type", value: detailData.visaTypeLabel },
                  { label: "Passport Number", value: detailData.applicant.passportNumber },
                  { label: "Nationality", value: detailData.applicant.nationality },
                  { label: "Travel Date", value: detailData.applicant.travelDate },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs font-jakarta">
                    <span className="text-on-surface-variant">{label}:</span>
                    <span className="font-semibold text-deep-navy">{value}</span>
                  </div>
                ))}
              </div>

              {/* Uploaded Documents */}
              <div>
                <h3 className="font-jakarta font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                  Uploaded Documents ({detailData.files?.length ?? 0})
                </h3>
                <div className="space-y-2">
                  {detailData.files?.length === 0 ? (
                    <p className="text-xs font-jakarta italic text-on-surface-variant/60">No files uploaded</p>
                  ) : (
                    detailData.files?.map((file: any) => (
                      <div key={file.fileId} className="flex items-center gap-2 p-2.5 rounded-xl bg-sand-beige/30 border border-outline-variant/20">
                        <span className="material-symbols-outlined text-champagne-gold text-base">attachment</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-jakarta font-semibold text-xs text-deep-navy truncate" title={file.originalName}>
                            {file.originalName}
                          </p>
                          <p className="font-jakarta text-[10px] text-on-surface-variant">
                            {file.documentLabel} · {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        {/* Download link for files (simulated, base64 content can be opened) */}
                        <a
                          href={`/api/visa/applications/download?fileId=${file.fileId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg hover:bg-outline-variant/15 flex items-center justify-center text-deep-navy transition-all"
                          title="Download document"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Internal Notes Section */}
              <div className="border-t border-outline-variant/10 pt-4">
                <h3 className="font-jakarta font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                  Internal Notes
                </h3>
                <form onSubmit={handleAddNote} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add an internal operations note..."
                    className="flex-1 px-3 py-2 border border-outline-variant rounded-xl bg-white font-jakarta text-xs text-deep-navy focus:outline-none"
                    aria-label="New internal note content"
                  />
                  <button
                    type="submit"
                    disabled={submittingNote || !noteContent.trim()}
                    className="px-3 py-2 rounded-xl bg-deep-navy text-white font-jakarta font-bold text-xs hover:bg-deep-navy/80 disabled:opacity-50"
                  >
                    Add
                  </button>
                </form>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                  {detailData.internalNotes?.length === 0 ? (
                    <p className="text-xs font-jakarta italic text-on-surface-variant/60">No notes yet</p>
                  ) : (
                    detailData.internalNotes?.map((note: any) => (
                      <div key={note.id} className="p-2 rounded-xl bg-sand-beige/25 border border-outline-variant/10 text-xs font-jakarta">
                        <div className="flex justify-between items-center mb-1 text-[10px]">
                          <span className="font-bold text-champagne-gold">{note.author}</span>
                          <span className="text-on-surface-variant/60">
                            {new Date(note.time).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-deep-navy leading-relaxed">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Activity Logs & Email History Timeline */}
              <div className="border-t border-outline-variant/10 pt-4 space-y-4">
                <div>
                  <h3 className="font-jakarta font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                    Activity Logs
                  </h3>
                  <div className="space-y-2 max-h-[120px] overflow-y-auto text-[11px] font-jakarta">
                    {detailData.activityLog?.map((act: any) => (
                      <div key={act.id} className="flex gap-2 items-start py-1 border-b border-outline-variant/5 last:border-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-deep-navy mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-deep-navy">{act.action}</p>
                          <p className="text-on-surface-variant">{act.details} — <span className="italic text-champagne-gold">{act.actor}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-jakarta font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                    Sent Emails log
                  </h3>
                  <div className="space-y-2 max-h-[120px] overflow-y-auto text-[11px] font-jakarta">
                    {detailData.emailLogs?.map((email: any) => (
                      <div key={email.id} className="p-2 rounded-lg bg-sand-beige/10 border border-outline-variant/10">
                        <div className="flex justify-between items-center text-[9px] mb-1">
                          <span className="font-semibold uppercase text-champagne-gold">
                            {email.type.replace("_", " ")}
                          </span>
                          <span className="text-on-surface-variant/60">
                            {new Date(email.sentAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-semibold text-deep-navy truncate">{email.subject}</p>
                        <p className="text-on-surface-variant/80 text-[10px] line-clamp-2 mt-0.5">{email.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center font-jakarta text-sm text-red-500">Error loading detail</p>
          )}
        </div>
      </div>
    </div>
  );
}
