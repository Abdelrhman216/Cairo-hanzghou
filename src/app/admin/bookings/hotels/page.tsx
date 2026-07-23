"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatEGP } from "@/lib/currency";
import StatusBadge from "@/components/ui/StatusBadge";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07 } }),
};

const bookings = [
  { id: "#HB-0121", guest: "Sarah Al-Mansouri", hotel: "Four Seasons Cairo", checkIn: "Aug 14", checkOut: "Aug 18", rooms: 1, amount: 84000, status: "confirmed", nights: 4 },
  { id: "#HB-0120", guest: "James Whitmore", hotel: "Ritz-Carlton Hangzhou", checkIn: "Sep 2", checkOut: "Sep 9", rooms: 2, amount: 203000, status: "confirmed", nights: 7 },
  { id: "#HB-0119", guest: "Li Wei", hotel: "Sofitel Legend Aswan", checkIn: "Aug 22", checkOut: "Aug 26", rooms: 1, amount: 64000, status: "pending", nights: 4 },
  { id: "#HB-0118", guest: "Nadia Hassan", hotel: "Four Seasons Cairo", checkIn: "Jul 30", checkOut: "Aug 2", rooms: 1, amount: 63000, status: "confirmed", nights: 3 },
  { id: "#HB-0117", guest: "Ahmed Youssef", hotel: "Ritz-Carlton Hangzhou", checkIn: "Sep 15", checkOut: "Sep 22", rooms: 1, amount: 203000, status: "pending", nights: 7 },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function HotelBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-caslon text-headline-lg text-deep-navy">Hotel Bookings</h1>
          <p className="font-jakarta text-body-md text-outline mt-1">Manage all hotel reservations</p>
        </div>
        <button className="bg-deep-navy text-white font-jakarta font-bold px-6 py-3 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Add Booking
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Bookings", value: "48", icon: "hotel", color: "bg-deep-navy text-white" },
          { label: "Confirmed", value: "41", icon: "check_circle", color: "bg-green-50 text-green-700" },
          { label: "Revenue (Jul)", value: "$34,200", icon: "payments", color: "bg-sand-beige text-champagne-gold" },
        ].map((card, i) => (
          <motion.div key={card.label} initial="hidden" animate="visible" variants={fadeUp} custom={i} className="bg-white rounded-xl p-6 shadow-luxury flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", card.color)}>
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <div>
              <p className="font-caslon text-headline-md text-deep-navy">{card.value}</p>
              <p className="font-jakarta text-label-sm text-outline">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-luxury overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
          <h2 className="font-caslon text-headline-md text-deep-navy">All Hotel Bookings</h2>
          <div className="flex gap-3">
            <input placeholder="Search bookings..." className="border border-outline-variant rounded-xl px-4 py-2 font-jakarta text-sm focus:outline-none focus:border-champagne-gold transition-colors" />
            <select className="border border-outline-variant rounded-xl px-4 py-2 font-jakarta text-sm focus:outline-none focus:border-champagne-gold transition-colors" aria-label="Filter by status">
              <option>All Status</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="text-left border-b border-outline-variant/20">
                {["ID", "Guest", "Hotel", "Check-in", "Check-out", "Nights", "Rooms", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {bookings.map((b, i) => (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + i * 0.05 }} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-jakarta font-bold text-deep-navy text-sm">{b.id}</td>
                  <td className="px-6 py-4 font-jakarta text-sm text-on-surface whitespace-nowrap">{b.guest}</td>
                  <td className="px-6 py-4 font-jakarta text-sm text-on-surface whitespace-nowrap">{b.hotel}</td>
                  <td className="px-6 py-4 font-jakarta text-sm text-outline">{b.checkIn}</td>
                  <td className="px-6 py-4 font-jakarta text-sm text-outline">{b.checkOut}</td>
                  <td className="px-6 py-4 font-jakarta text-sm text-on-surface">{b.nights}</td>
                  <td className="px-6 py-4 font-jakarta text-sm text-on-surface">{b.rooms}</td>
                  <td className="px-6 py-4 font-jakarta font-bold text-champagne-gold">{formatEGP(b.amount)}</td>
                  <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-champagne-gold transition-colors" aria-label="Edit booking">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-error transition-colors" aria-label="Delete booking">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
