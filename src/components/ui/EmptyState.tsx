"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon = "search_off",
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 py-16 bg-white rounded-xl border border-outline-variant/30 shadow-luxury max-w-lg mx-auto",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-sand-beige flex items-center justify-center text-champagne-gold mb-6">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="font-caslon text-headline-md text-deep-navy mb-2">{title}</h3>
      <p className="font-jakarta text-body-md text-outline mb-6 leading-relaxed max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-deep-navy text-white font-jakarta font-semibold px-6 py-2.5 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95 text-sm"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
