"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import {
  addTravelRequestNote,
  assignTravelRequest,
  fetchTravelRequests,
  updateTravelRequestStatus,
} from "@/lib/api-client";
import type { RequestStatus, TravelRequest } from "@/lib/api-client";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const EMPLOYEES = ["Ahmed Youssef", "Sarah Mansour", "Li Wei", "Nadia Hassan"];
const STATUSES: RequestStatus[] = ["Pending", "Under Review", "Documents Required", "Approved", "Rejected", "Completed"];
const TYPES = ["All", "visa", "flight", "hotel", "package", "custom"];

export default function AdminDashboard() {
  const [requests, setRequests] = useState<TravelRequest[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  
  // Selection & Forms state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Note input
  const [noteContent, setNoteContent] = useState("");
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reloadRequests = async () => {
    try {
      const data = await fetchTravelRequests();
      setRequests(data.requests);
      setActivities(data.activityLogs);
      setEmails(data.emailLogs);
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Failed to load requests");
    }
  };

  useEffect(() => {
    reloadRequests();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedRequest = useMemo(() => {
    return requests.find((r) => r.id === selectedId) || null;
  }, [requests, selectedId]);

  // Filters computed
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        searchQuery === "" ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchType = typeFilter === "All" || r.type === typeFilter;
      const matchStatus = statusFilter === "All" || r.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [requests, searchQuery, typeFilter, statusFilter]);

  // KPI Calculations
  const kpiStats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "Pending").length;
    const review = requests.filter((r) => r.status === "Under Review").length;
    const approved = requests.filter((r) => r.status === "Approved" || r.status === "Completed").length;
    return { total, pending, review, approved };
  }, [requests]);

  // Actions handlers
  const handleStatusChange = async (id: string, newStatus: RequestStatus) => {
    try {
      await updateTravelRequestStatus(id, newStatus);
      await reloadRequests();
      triggerToast(`Status updated to ${newStatus} for ${id}`);
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  const handleAssigneeChange = async (id: string, newAssignee: string) => {
    try {
      await assignTravelRequest(id, newAssignee);
      await reloadRequests();
      triggerToast(`Assigned ${id} to ${newAssignee}`);
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Failed to assign request");
    }
  };

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !noteContent.trim()) return;

    try {
      await addTravelRequestNote(selectedId, noteContent);
      await reloadRequests();
      setNoteContent("");
      triggerToast("Internal note saved successfully");
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Failed to save note");
    }
  };

  // Mock Exports
  const handleExportCSV = () => {
    if (filteredRequests.length === 0) {
      triggerToast("No requests available to export.");
      return;
    }
    // Generate CSV contents
    const headers = "Request ID,Customer,Type,Title,Status,Amount,Assigned To,Created Time\n";
    const rows = filteredRequests.map(r => 
      `"${r.id}","${r.customerName}","${r.type}","${r.title}","${r.status}",$${r.amount},"${r.assignedTo || "Unassigned"}","${r.createdTime}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `CH-Requests-Export-${new Date().toISOString().slice(0,10)}.csv`);
    a.click();
    triggerToast("Excel CSV export downloaded successfully!");
  };

  const handleExportPDF = () => {
    window.print();
  };

  // Filter Timeline & Emails for selected ID
  const selectedActivities = useMemo(() => {
    if (!selectedId) return [];
    return activities.filter((a) => a.requestId === selectedId);
  }, [activities, selectedId]);

  const selectedEmails = useMemo(() => {
    if (!selectedId) return [];
    return emails.filter((e) => e.requestId === selectedId);
  }, [emails, selectedId]);

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-deep-navy text-white px-6 py-3.5 rounded-xl shadow-luxury-lg border border-champagne-gold/30 font-jakarta text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-champagne-gold text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-caslon text-headline-lg text-deep-navy">Request Management Center</h1>
          <p className="font-jakarta text-body-md text-outline mt-1">Review bookings, track statuses, and assign tasks</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-white border border-outline-variant text-deep-navy font-jakarta font-semibold px-5 py-2.5 rounded-full hover:bg-sand-beige transition-all text-sm flex items-center gap-2 shadow-luxury active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">download</span> Export to Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-deep-navy text-white font-jakarta font-semibold px-5 py-2.5 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all text-sm flex items-center gap-2 shadow-luxury active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">print</span> Print PDF Report
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Submissions", value: kpiStats.total, icon: "assignment", color: "bg-deep-navy text-white" },
          { label: "Pending", value: kpiStats.pending, icon: "hourglass_empty", color: "bg-amber-50 text-amber-700 bg-amber-500/10 border-amber-500/10" },
          { label: "Under Review", value: kpiStats.review, icon: "search", color: "bg-blue-50 text-blue-700 bg-blue-500/10 border-blue-500/10" },
          { label: "Approved / Done", value: kpiStats.approved, icon: "verified", color: "bg-green-50 text-green-700 bg-green-500/10 border-green-500/10" },
        ].map((card, i) => (
          <motion.div key={card.label} initial="hidden" animate="visible" variants={fadeUp} custom={i} className="bg-white rounded-xl p-5 shadow-luxury border border-outline-variant/10 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", card.color)}>
              <span className="material-symbols-outlined text-xl">{card.icon}</span>
            </div>
            <div>
              <p className="font-caslon text-headline-md text-deep-navy font-bold leading-none mb-1">{card.value}</p>
              <p className="font-jakarta text-[11px] text-outline uppercase tracking-wider font-semibold">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Requests Table Column */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-luxury overflow-hidden border border-outline-variant/15">
          {/* Filters Topbar */}
          <div className="p-6 border-b border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-caslon text-headline-md text-deep-navy">Requests Queue</h2>
              <span className="bg-sand-beige text-deep-navy px-3 py-1 rounded-full text-xs font-bold font-jakarta">
                {filteredRequests.length} listed
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-champagne-gold text-sm">search</span>
                <input
                  placeholder="Search name, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-outline-variant rounded-xl font-jakarta text-xs text-deep-navy focus:outline-none focus:border-champagne-gold bg-white"
                  aria-label="Search requests queue"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-outline-variant rounded-xl px-3 py-2 font-jakarta text-xs text-deep-navy focus:outline-none focus:border-champagne-gold bg-white capitalize"
                aria-label="Filter by type"
              >
                {TYPES.map((t) => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-outline-variant rounded-xl px-3 py-2 font-jakarta text-xs text-deep-navy focus:outline-none focus:border-champagne-gold bg-white"
                aria-label="Filter by status"
              >
                <option value="All">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Table content */}
          <div className="overflow-x-auto">
            {filteredRequests.length > 0 ? (
              <table className="w-full" role="table">
                <thead>
                  <tr className="text-left border-b border-outline-variant/15 bg-sand-beige/10">
                    {["ID", "Customer", "Type", "Details", "Assigned", "Status"].map((h) => (
                      <th key={h} className="px-6 py-3.5 font-jakarta font-bold text-[10px] text-outline uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {filteredRequests.map((r, i) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className={cn(
                        "hover:bg-surface-container-low transition-colors duration-200 cursor-pointer group",
                        selectedId === r.id ? "bg-sand-beige/20" : ""
                      )}
                    >
                      <td className="px-6 py-4 font-jakarta font-bold text-deep-navy text-xs">{r.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-jakarta font-bold text-deep-navy text-sm">{r.customerName}</p>
                        <p className="font-jakarta text-[11px] text-outline">{r.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize font-jakarta text-xs font-semibold text-deep-navy bg-sand-beige px-2.5 py-1 rounded-md">
                          {r.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-64">
                        <p className="font-jakarta text-sm text-deep-navy font-semibold truncate">{r.title}</p>
                        <p className="font-jakarta text-[11px] text-outline truncate">{r.details}</p>
                      </td>
                      <td className="px-6 py-4 font-jakarta text-xs text-on-surface whitespace-nowrap">
                        {r.assignedTo ? (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-champagne-gold">person</span>
                            {r.assignedTo}
                          </span>
                        ) : (
                          <span className="text-outline italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12">
                <EmptyState
                  title="No Requests Match Filters"
                  description="We couldn't find any request in the database matching your active search filters."
                  actionLabel="Reset Queue Filters"
                  onAction={() => {
                    setSearchQuery("");
                    setTypeFilter("All");
                    setStatusFilter("All");
                  }}
                  className="border-none shadow-none mx-auto"
                />
              </div>
            )}
          </div>
        </div>

        {/* Details Panel Column */}
        <div className="lg:sticky lg:top-24">
          <AnimatePresence mode="wait">
            {selectedRequest ? (
              <motion.div
                key={selectedRequest.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-xl p-6 shadow-luxury border border-outline-variant/15 space-y-6"
              >
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
                  <div>
                    <span className="bg-champagne-gold/15 text-champagne-gold px-2.5 py-1 rounded-md text-[10px] font-bold font-jakarta tracking-wider uppercase mb-1.5 inline-block">
                      {selectedRequest.type} Detail
                    </span>
                    <h2 className="font-caslon text-headline-md text-deep-navy leading-none">
                      {selectedRequest.id}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="w-8 h-8 rounded-full bg-sand-beige flex items-center justify-center text-deep-navy hover:bg-champagne-gold hover:text-white transition-all"
                    aria-label="Close details panel"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                {/* Client Info Summary */}
                <div className="space-y-2 bg-sand-beige/25 p-4 rounded-xl border border-outline-variant/10">
                  <h3 className="font-jakarta font-bold text-deep-navy text-xs uppercase tracking-wider">Client Info</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs font-jakarta">
                    <div>
                      <p className="text-outline">Name</p>
                      <p className="font-semibold text-deep-navy truncate">{selectedRequest.customerName}</p>
                    </div>
                    <div>
                      <p className="text-outline">Phone</p>
                      <p className="font-semibold text-deep-navy truncate">{selectedRequest.phone}</p>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-outline-variant/10">
                      <p className="text-outline">Email Address</p>
                      <p className="font-semibold text-deep-navy truncate">{selectedRequest.email}</p>
                    </div>
                  </div>
                </div>

                {/* Details Description */}
                <div>
                  <h3 className="font-jakarta font-bold text-deep-navy text-xs uppercase tracking-wider mb-2">Request Details</h3>
                  <p className="font-jakarta text-sm text-deep-navy font-bold">{selectedRequest.title}</p>
                  <p className="font-jakarta text-xs text-outline mt-1.5 leading-relaxed">{selectedRequest.details}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-outline-variant/10 pt-3 text-xs font-jakarta">
                    <span className="text-outline">Price Total</span>
                    <span className="font-caslon font-bold text-base text-champagne-gold">${selectedRequest.amount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Uploaded Documents */}
                {selectedRequest.documents.length > 0 && (
                  <div>
                    <h3 className="font-jakarta font-bold text-deep-navy text-xs uppercase tracking-wider mb-3">Documents Attachment</h3>
                    <div className="space-y-2">
                      {selectedRequest.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-sand-beige/10 border border-outline-variant/15 rounded-xl text-xs font-jakarta">
                          <span className="flex items-center gap-1.5 min-w-0">
                            <span className="material-symbols-outlined text-champagne-gold text-sm">description</span>
                            <span className="font-semibold text-deep-navy truncate">{doc.name}</span>
                          </span>
                          <span className="text-[10px] text-outline shrink-0">{doc.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Operations Actions Dropdowns */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-outline-variant/15">
                  <div className="space-y-1">
                    <label htmlFor="detail-status" className="font-jakarta font-bold text-[10px] text-outline uppercase tracking-wider block">Status</label>
                    <select
                      id="detail-status"
                      value={selectedRequest.status}
                      onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value as RequestStatus)}
                      className="w-full border border-outline-variant rounded-xl px-3 py-2 font-jakarta text-xs text-deep-navy focus:outline-none focus:border-champagne-gold bg-white"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="detail-assignee" className="font-jakarta font-bold text-[10px] text-outline uppercase tracking-wider block">Assignee</label>
                    <select
                      id="detail-assignee"
                      value={selectedRequest.assignedTo}
                      onChange={(e) => handleAssigneeChange(selectedRequest.id, e.target.value)}
                      className="w-full border border-outline-variant rounded-xl px-3 py-2 font-jakarta text-xs text-deep-navy focus:outline-none focus:border-champagne-gold bg-white"
                    >
                      <option value="">Unassigned</option>
                      {EMPLOYEES.map((emp) => <option key={emp} value={emp}>{emp}</option>)}
                    </select>
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="pt-4 border-t border-outline-variant/15">
                  <h3 className="font-jakarta font-bold text-deep-navy text-xs uppercase tracking-wider mb-3">Internal Notes</h3>
                  <form onSubmit={handleAddNoteSubmit} className="flex gap-2 mb-3">
                    <input
                      placeholder="Add team note..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="flex-1 border border-outline-variant rounded-xl px-3 py-2 font-jakarta text-xs text-deep-navy focus:outline-none focus:border-champagne-gold bg-white"
                      aria-label="Type internal note"
                    />
                    <button
                      type="submit"
                      className="bg-deep-navy text-white px-3 py-2 rounded-xl text-xs hover:bg-champagne-gold hover:text-deep-navy font-semibold active:scale-95 transition-all shrink-0"
                    >
                      Add
                    </button>
                  </form>
                  {selectedRequest.internalNotes.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                      {selectedRequest.internalNotes.map((note) => (
                        <div key={note.id} className="bg-sand-beige/25 p-2 rounded-xl text-[11px] font-jakarta border border-outline-variant/5">
                          <div className="flex justify-between text-[9px] text-outline mb-1 font-semibold">
                            <span>{note.author}</span>
                            <span>{new Date(note.time).toLocaleDateString()}</span>
                          </div>
                          <p className="text-deep-navy leading-normal">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-outline italic font-jakarta">No internal notes added yet.</p>
                  )}
                </div>

                {/* Email History */}
                <div className="pt-4 border-t border-outline-variant/15">
                  <h3 className="font-jakarta font-bold text-deep-navy text-xs uppercase tracking-wider mb-3">Email Logs ({selectedEmails.length})</h3>
                  {selectedEmails.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                      {selectedEmails.map((log) => (
                        <div key={log.id} className="p-2 border border-outline-variant/10 rounded-xl text-[11px] font-jakarta">
                          <div className="flex justify-between text-[9px] text-outline mb-0.5">
                            <span className="font-semibold text-champagne-gold uppercase tracking-wider text-[8px]">{log.type.replace("_"," ")}</span>
                            <span>{new Date(log.sentTime).toLocaleDateString()}</span>
                          </div>
                          <p className="font-bold text-deep-navy truncate">{log.subject}</p>
                          <p className="text-outline text-[10px] line-clamp-1">{log.to}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-outline italic font-jakarta">No emails dispatched yet.</p>
                  )}
                </div>

                {/* Activity Timeline */}
                <div className="pt-4 border-t border-outline-variant/15">
                  <h3 className="font-jakarta font-bold text-deep-navy text-xs uppercase tracking-wider mb-4">Activity Log</h3>
                  {selectedActivities.length > 0 ? (
                    <div className="relative pl-4 space-y-4 border-l border-outline-variant/30 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                      {selectedActivities.map((act) => (
                        <div key={act.id} className="relative text-[11px] font-jakarta">
                          {/* Dot marker */}
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-champagne-gold rounded-full border-2 border-white" />
                          <p className="font-bold text-deep-navy">{act.action}</p>
                          <p className="text-outline text-[10px] leading-normal">{act.details}</p>
                          <p className="text-[9px] text-outline mt-0.5 font-semibold">
                            By {act.actor} · {new Date(act.time).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-outline italic font-jakarta">No activity logs recorded.</p>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Fallback default Panel widget view (original elements preserved!) */
              <div className="space-y-6">
                {/* Original Quick Links */}
                <div className="bg-white rounded-xl shadow-luxury p-6 border border-outline-variant/15">
                  <h2 className="font-caslon text-headline-md text-deep-navy mb-4">Quick Links</h2>
                  <div className="space-y-3">
                    {[
                      { label: "Hotel Bookings", href: "/admin/bookings/hotels", icon: "hotel", count: 48 },
                      { label: "Flight Requests", href: "/admin/bookings/flights", icon: "flight", count: 23 },
                      { label: "Visa Applications", href: "/admin/visa", icon: "badge", count: 15 },
                      { label: "Support Tickets", href: "/admin/support", icon: "support_agent", count: 7 },
                    ].map((ql) => (
                      <Link
                        key={ql.label}
                        href={ql.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-sand-beige transition-all duration-300 group"
                      >
                        <div className="w-10 h-10 bg-sand-beige rounded-xl flex items-center justify-center group-hover:bg-champagne-gold/20 transition-colors shrink-0">
                          <span className="material-symbols-outlined text-champagne-gold text-base">{ql.icon}</span>
                        </div>
                        <span className="flex-1 font-jakarta font-semibold text-sm text-deep-navy">{ql.label}</span>
                        <span className="w-6 h-6 bg-deep-navy text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{ql.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Original Revenue progress indicators */}
                <div className="bg-deep-navy rounded-xl p-6 text-white shadow-luxury">
                  <h2 className="font-caslon text-headline-md text-white mb-1">Monthly Revenue</h2>
                  <p className="font-jakarta text-label-sm text-white/60 mb-6">July 2026</p>
                  {[
                    { label: "Packages", value: 142860, pct: 75 },
                    { label: "Flights", value: 84200, pct: 55 },
                    { label: "Visa", value: 34500, pct: 35 },
                    { label: "Hotels", value: 23360, pct: 20 },
                  ].map((item) => (
                    <div key={item.label} className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-jakarta text-white/70">{item.label}</span>
                        <span className="font-jakarta font-bold text-champagne-gold">${(item.value / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ delay: 0.2, duration: 0.8 }}
                          className="h-full bg-champagne-gold rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
