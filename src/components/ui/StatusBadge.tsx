"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; style: string }> = {
  confirmed: { label: "Confirmed", style: "bg-green-500/10 text-green-600 border-green-500/20" },
  pending: { label: "Pending", style: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  approved: { label: "Approved", style: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  "under-review": { label: "Under Review", style: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  "under review": { label: "Under Review", style: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  cancelled: { label: "Cancelled", style: "bg-red-500/10 text-red-600 border-red-500/20" },
  active: { label: "Active", style: "bg-green-500/10 text-green-600 border-green-500/20" },
  inactive: { label: "Inactive", style: "bg-red-500/10 text-red-600 border-red-500/20" },
  scheduled: { label: "Scheduled", style: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  completed: { label: "Completed", style: "bg-outline/10 text-outline border-outline/20" },
  open: { label: "Open", style: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  "in-progress": { label: "In Progress", style: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  "in progress": { label: "In Progress", style: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  resolved: { label: "Resolved", style: "bg-green-500/10 text-green-600 border-green-500/20" },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const normStatus = status.toLowerCase();
  const conf = statusConfig[normStatus] || { label: status, style: "bg-outline/10 text-outline border-outline/20" };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300",
        conf.style,
        className
      )}
    >
      {conf.label}
    </span>
  );
}
