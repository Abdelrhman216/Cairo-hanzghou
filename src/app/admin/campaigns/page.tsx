"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";

const campaigns = [
  { id: "C-001", title: "Summer Egypt Escape", type: "Promotion", target: "All Users", status: "active", sent: 12450, opens: 4890, clicks: 1240, startDate: "Jul 1", endDate: "Jul 31" },
  { id: "C-002", title: "West Lake Autumn Package", type: "Email", target: "Premium", status: "scheduled", sent: 0, opens: 0, clicks: 0, startDate: "Aug 1", endDate: "Aug 31" },
  { id: "C-003", title: "Visa Fast-Track Offer", type: "Push", target: "All Users", status: "completed", sent: 8200, opens: 3100, clicks: 890, startDate: "Jun 15", endDate: "Jun 30" },
];

export default function CampaignsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const statusColors: Record<string,string> = { active:"bg-green-100 text-green-700", scheduled:"bg-blue-100 text-blue-700", completed:"bg-surface-container text-outline" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-caslon text-headline-lg text-deep-navy">Campaigns & Alerts</h1>
          <p className="font-jakarta text-body-md text-outline mt-1">Manage marketing campaigns and user notifications</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-deep-navy text-white font-jakarta font-bold px-6 py-3 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Campaigns", value: "3", icon: "campaign" },
          { label: "Emails Sent (Jul)", value: "12,450", icon: "mail" },
          { label: "Avg. Open Rate", value: "39.3%", icon: "open_in_new" },
        ].map((c,i) => (
          <motion.div key={c.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }} className="bg-white rounded-xl p-6 shadow-luxury flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-deep-navy flex items-center justify-center">
              <span className="material-symbols-outlined text-champagne-gold">{c.icon}</span>
            </div>
            <div>
              <p className="font-caslon text-headline-md text-deep-navy">{c.value}</p>
              <p className="font-jakarta text-label-sm text-outline">{c.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Campaign Cards */}
      <div className="space-y-4">
        {campaigns.map((c,i) => (
          <motion.div key={c.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2+i*0.1 }} className="bg-white rounded-xl p-6 shadow-luxury hover:shadow-luxury-md transition-all">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-caslon text-headline-md text-deep-navy">{c.title}</h2>
                  <StatusBadge status={c.status} />
                </div>
                <p className="font-jakarta text-label-sm text-outline">
                  {c.type} · Target: {c.target} · {c.startDate} – {c.endDate}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center hover:text-champagne-gold transition-colors" aria-label="Edit campaign">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center hover:text-error transition-colors" aria-label="Delete campaign">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Sent", value: c.sent.toLocaleString(), icon: "send" },
                { label: "Opens", value: c.opens.toLocaleString(), icon: "open_in_new" },
                { label: "Clicks", value: c.clicks.toLocaleString(), icon: "ads_click" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sand-beige flex items-center justify-center">
                    <span className="material-symbols-outlined text-champagne-gold text-sm">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="font-caslon text-sm font-bold text-deep-navy">{stat.value}</p>
                    <p className="font-jakarta text-label-sm text-outline">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-xl shadow-luxury p-6">
        <h2 className="font-caslon text-headline-md text-deep-navy mb-4">Send Alert</h2>
        <div className="space-y-4">
          <div>
            <label className="font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block mb-2">Alert Title</label>
            <input className="w-full border border-outline-variant rounded-xl px-4 py-3 font-jakarta text-sm focus:outline-none focus:border-champagne-gold transition-colors" placeholder="e.g. Limited-Time Offer" />
          </div>
          <div>
            <label className="font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block mb-2">Message</label>
            <textarea rows={3} className="w-full border border-outline-variant rounded-xl px-4 py-3 font-jakarta text-sm focus:outline-none focus:border-champagne-gold transition-colors resize-none" placeholder="Enter your alert message..." />
          </div>
          <div className="flex gap-3">
            <select className="flex-1 border border-outline-variant rounded-xl px-4 py-3 font-jakarta text-sm focus:outline-none focus:border-champagne-gold" aria-label="Target audience">
              <option>All Users</option><option>Premium Members</option><option>Standard Members</option>
            </select>
            <button className="bg-deep-navy text-white font-jakarta font-bold px-8 py-3 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">send</span> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
