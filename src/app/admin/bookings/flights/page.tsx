"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";

const flights = [
  { id: "#FB-0441", passenger: "Sarah Al-Mansouri", route: "CAI → HGH", date: "Aug 15", airline: "EgyptAir MS895", class: "Business", amount: 2840, status: "confirmed" },
  { id: "#FB-0440", passenger: "James Whitmore", route: "HGH → CAI", date: "Sep 10", airline: "Air China CA975", class: "Economy", amount: 1200, status: "pending" },
  { id: "#FB-0439", passenger: "Dr. Fatima Al-Rashid", route: "CAI → HGH", date: "Aug 22", airline: "EgyptAir MS895", class: "First", amount: 3600, status: "confirmed" },
  { id: "#FB-0438", passenger: "Mohamed Karim", route: "CAI → HGH", date: "Jul 30", airline: "EgyptAir MS895", class: "Business", amount: 2840, status: "cancelled" },
];
const statusColors: Record<string,string> = { confirmed:"bg-green-100 text-green-700", pending:"bg-amber-100 text-amber-700", cancelled:"bg-red-100 text-red-700" };

export default function FlightRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-caslon text-headline-lg text-deep-navy">Flight Requests</h1>
          <p className="font-jakarta text-body-md text-outline mt-1">Manage all flight bookings and requests</p>
        </div>
        <button className="bg-deep-navy text-white font-jakarta font-bold px-6 py-3 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span> Add Flight
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Flights", value: "23", icon: "flight" },
          { label: "Confirmed", value: "18", icon: "check_circle" },
          { label: "Revenue (Jul)", value: "$64,800", icon: "payments" },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }} className="bg-white rounded-xl p-6 shadow-luxury flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-deep-navy flex items-center justify-center">
              <span className="material-symbols-outlined text-white">{c.icon}</span>
            </div>
            <div>
              <p className="font-caslon text-headline-md text-deep-navy">{c.value}</p>
              <p className="font-jakarta text-label-sm text-outline">{c.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="bg-white rounded-xl shadow-luxury overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
          <h2 className="font-caslon text-headline-md text-deep-navy">Flight Requests</h2>
          <input placeholder="Search..." className="border border-outline-variant rounded-xl px-4 py-2 font-jakarta text-sm focus:outline-none focus:border-champagne-gold" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left border-b border-outline-variant/20">
              {["ID","Passenger","Route","Date","Airline","Class","Amount","Status","Actions"].map(h=>(
                <th key={h} className="px-6 py-3 font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-outline-variant/20">
              {flights.map((f,i) => (
                <motion.tr key={f.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25+i*0.05 }} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-jakarta font-bold text-deep-navy text-sm">{f.id}</td>
                  <td className="px-6 py-4 font-jakarta text-sm whitespace-nowrap">{f.passenger}</td>
                  <td className="px-6 py-4 font-jakarta text-sm font-semibold text-deep-navy">{f.route}</td>
                  <td className="px-6 py-4 font-jakarta text-sm text-outline">{f.date}</td>
                  <td className="px-6 py-4 font-jakarta text-sm whitespace-nowrap">{f.airline}</td>
                  <td className="px-6 py-4 font-jakarta text-sm">{f.class}</td>
                  <td className="px-6 py-4 font-jakarta font-bold text-champagne-gold">${f.amount.toLocaleString()}</td>
                  <td className="px-6 py-4"><StatusBadge status={f.status} /></td>
                  <td className="px-6 py-4"><div className="flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center hover:text-champagne-gold" aria-label="Edit"><span className="material-symbols-outlined text-sm">edit</span></button>
                    <button className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center hover:text-error" aria-label="Delete"><span className="material-symbols-outlined text-sm">delete</span></button>
                  </div></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
