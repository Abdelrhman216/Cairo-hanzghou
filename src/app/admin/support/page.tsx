"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";

const tickets = [
  { id: "#TK-0441", user: "Sarah Al-Mansouri", subject: "Flight rescheduling request", category: "Flights", priority: "high", status: "open", created: "Jul 10, 10:23" },
  { id: "#TK-0440", user: "James Whitmore", subject: "Visa document clarification needed", category: "Visa", priority: "medium", status: "in-progress", created: "Jul 9, 14:05" },
  { id: "#TK-0439", user: "Mohamed Karim", subject: "Hotel room upgrade inquiry", category: "Hotels", priority: "low", status: "resolved", created: "Jul 8, 09:30" },
  { id: "#TK-0438", user: "Dr. Fatima Al-Rashid", subject: "Package refund request", category: "Packages", priority: "high", status: "open", created: "Jul 7, 16:45" },
  { id: "#TK-0437", user: "Li Wei", subject: "Airport transfer confirmation", category: "Transfers", priority: "medium", status: "resolved", created: "Jul 6, 11:20" },
];
const priorityColors: Record<string,string> = { high:"bg-red-100 text-red-700", medium:"bg-amber-100 text-amber-700", low:"bg-green-100 text-green-700" };
const statusColors: Record<string,string> = { open:"bg-blue-100 text-blue-700", "in-progress":"bg-amber-100 text-amber-700", resolved:"bg-green-100 text-green-700" };

export default function SupportCenterPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-caslon text-headline-lg text-deep-navy">Support Center</h1>
          <p className="font-jakarta text-body-md text-outline mt-1">Manage customer support tickets and inquiries</p>
        </div>
        <button className="bg-deep-navy text-white font-jakarta font-bold px-6 py-3 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span> New Ticket
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Open Tickets", value: "7", icon: "confirmation_number" },
          { label: "In Progress", value: "12", icon: "pending" },
          { label: "Resolved Today", value: "24", icon: "check_circle" },
          { label: "Avg. Response", value: "2.4h", icon: "schedule" },
        ].map((c,i) => (
          <motion.div key={c.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }} className="bg-white rounded-xl p-6 shadow-luxury">
            <div className="w-10 h-10 rounded-xl bg-sand-beige flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-champagne-gold">{c.icon}</span>
            </div>
            <p className="font-caslon text-headline-md text-deep-navy">{c.value}</p>
            <p className="font-jakarta text-label-sm text-outline">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="bg-white rounded-xl shadow-luxury overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
          <h2 className="font-caslon text-headline-md text-deep-navy">Support Tickets</h2>
          <div className="flex gap-3">
            <input placeholder="Search tickets..." className="border border-outline-variant rounded-xl px-4 py-2 font-jakarta text-sm focus:outline-none focus:border-champagne-gold" />
            <select className="border border-outline-variant rounded-xl px-4 py-2 font-jakarta text-sm focus:outline-none focus:border-champagne-gold" aria-label="Filter by status">
              <option>All Status</option><option>Open</option><option>In Progress</option><option>Resolved</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-outline-variant/20">
          {tickets.map((t,i) => (
            <motion.div
              key={t.id}
              initial={{ opacity:0, x:-10 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.25+i*0.06 }}
              onClick={() => setSelected(t.id === selected ? null : t.id)}
              className="px-6 py-4 hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-sand-beige rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-champagne-gold text-base">support_agent</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-jakarta font-bold text-deep-navy text-sm">{t.id}</span>
                      <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-bold uppercase", priorityColors[t.priority])}>{t.priority}</span>
                      <span className="font-jakarta text-label-sm text-outline">{t.category}</span>
                    </div>
                    <p className="font-jakarta text-sm text-on-surface truncate">{t.subject}</p>
                    <p className="font-jakarta text-label-sm text-outline">{t.user} · {t.created}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={t.status} />
                  <button className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center hover:text-champagne-gold" aria-label="Reply">
                    <span className="material-symbols-outlined text-sm">reply</span>
                  </button>
                </div>
              </div>
              {selected === t.id && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} className="mt-4 pl-14">
                  <textarea
                    className="w-full border border-outline-variant rounded-xl p-4 font-jakarta text-sm focus:outline-none focus:border-champagne-gold resize-none"
                    rows={3}
                    placeholder="Type your response..."
                  />
                  <div className="flex gap-3 mt-3">
                    <button className="bg-deep-navy text-white font-jakarta font-semibold px-6 py-2 rounded-full text-sm hover:bg-champagne-gold hover:text-deep-navy transition-all">
                      Send Reply
                    </button>
                    <button className="bg-surface-container text-on-surface-variant font-jakarta font-semibold px-6 py-2 rounded-full text-sm hover:bg-sand-beige transition-all">
                      Mark Resolved
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
