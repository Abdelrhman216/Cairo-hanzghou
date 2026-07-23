"use client";
import { motion } from "framer-motion";
import { formatEGP } from "@/lib/currency";

const monthlyData = [
  { month: "Jan", revenue: 180000, bookings: 142 },
  { month: "Feb", revenue: 220000, bookings: 178 },
  { month: "Mar", revenue: 195000, bookings: 156 },
  { month: "Apr", revenue: 248000, bookings: 201 },
  { month: "May", revenue: 310000, bookings: 254 },
  { month: "Jun", revenue: 284000, bookings: 230 },
  { month: "Jul", revenue: 284920, bookings: 247 },
];
const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

const transactions = [
  { id: "TXN-9901", guest: "Sarah Al-Mansouri", type: "Package", amount: 2890, method: "Credit Card", date: "Jul 10", status: "completed" },
  { id: "TXN-9900", guest: "James Whitmore", type: "Flight", amount: 1200, method: "PayPal", date: "Jul 9", status: "completed" },
  { id: "TXN-9899", guest: "Dr. Fatima Al-Rashid", type: "Hotel", amount: 1680, method: "Bank Transfer", date: "Jul 8", status: "pending" },
  { id: "TXN-9898", guest: "Li Wei", type: "Visa", amount: 120, method: "Credit Card", date: "Jul 7", status: "completed" },
];

export default function PaymentsAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-caslon text-headline-lg text-deep-navy">Payments & Analytics</h1>
        <p className="font-jakarta text-body-md text-outline mt-1">Financial overview and revenue analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$284,920", change: "+12.4%", up: true, icon: "payments" },
          { label: "This Month", value: "$34,200", change: "+8.1%", up: true, icon: "calendar_month" },
          { label: "Avg. Booking Value", value: "$1,152", change: "+3.2%", up: true, icon: "trending_up" },
          { label: "Refunds", value: "$2,100", change: "-0.8%", up: false, icon: "undo" },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }} className="bg-white rounded-xl p-6 shadow-luxury">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-deep-navy flex items-center justify-center">
                <span className="material-symbols-outlined text-champagne-gold text-lg">{c.icon}</span>
              </div>
              <span className={`font-jakarta font-bold text-label-sm flex items-center gap-1 ${c.up ? 'text-green-600' : 'text-error'}`}>
                <span className="material-symbols-outlined text-sm">{c.up ? 'trending_up' : 'trending_down'}</span>
                {c.change}
              </span>
            </div>
            <p className="font-caslon text-headline-md text-deep-navy">{c.value}</p>
            <p className="font-jakarta text-label-sm text-outline mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} className="xl:col-span-2 bg-white rounded-xl shadow-luxury p-6">
          <h2 className="font-caslon text-headline-md text-deep-navy mb-6">Monthly Revenue</h2>
          <div className="flex items-end gap-3 h-48">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <p className="font-jakarta text-label-sm text-outline text-center">${(d.revenue/1000).toFixed(0)}k</p>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.revenue / maxRevenue) * 160}px` }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.6 }}
                  className="w-full rounded-t-xl bg-deep-navy hover:bg-champagne-gold transition-colors duration-300 cursor-pointer relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-deep-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {d.bookings} bookings
                  </div>
                </motion.div>
                <p className="font-jakarta text-label-sm text-outline">{d.month}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Breakdown */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }} className="bg-white rounded-xl shadow-luxury p-6">
          <h2 className="font-caslon text-headline-md text-deep-navy mb-6">Revenue Breakdown</h2>
          <div className="space-y-5">
            {[
              { label: "Packages", value: "$142,860", pct: 50, color: "bg-deep-navy" },
              { label: "Flights", value: "$84,200", pct: 30, color: "bg-champagne-gold" },
              { label: "Hotels", value: "$34,560", pct: 12, color: "bg-sand-beige border border-champagne-gold" },
              { label: "Visa", value: "$23,300", pct: 8, color: "bg-outline-variant" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-jakarta font-semibold text-on-surface">{item.label}</span>
                  <span className="font-jakarta font-bold text-champagne-gold">{item.value}</span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
                <p className="font-jakarta text-label-sm text-outline mt-1">{item.pct}% of total</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }} className="bg-white rounded-xl shadow-luxury overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/30">
          <h2 className="font-caslon text-headline-md text-deep-navy">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left border-b border-outline-variant/20">
              {["Transaction ID","Guest","Type","Amount","Method","Date","Status"].map(h=>(
                <th key={h} className="px-6 py-3 font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-outline-variant/20">
              {transactions.map((t,i) => (
                <motion.tr key={t.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.45+i*0.05 }} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-jakarta font-bold text-deep-navy text-sm">{t.id}</td>
                  <td className="px-6 py-4 font-jakarta text-sm whitespace-nowrap">{t.guest}</td>
                  <td className="px-6 py-4 font-jakarta text-sm">{t.type}</td>
                  <td className="px-6 py-4 font-jakarta font-bold text-champagne-gold">{formatEGP(t.amount)}</td>
                  <td className="px-6 py-4 font-jakarta text-sm text-outline">{t.method}</td>
                  <td className="px-6 py-4 font-jakarta text-sm text-outline">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-label-sm font-bold capitalize ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {t.status}
                    </span>
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
