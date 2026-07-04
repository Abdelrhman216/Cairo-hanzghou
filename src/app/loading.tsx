"use client";

import { motion } from "framer-motion";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6" role="status" aria-live="polite" aria-label="Loading Cairo Hangzhou Website">
      <div className="flex flex-col items-center max-w-sm text-center">
        {/* Animated Brand Symbol/Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-16 h-16 mb-8 flex items-center justify-center rounded-xl bg-deep-navy shadow-luxury-md"
        >
          <span className="material-symbols-outlined text-champagne-gold text-3xl animate-pulse">explore</span>
        </motion.div>

        {/* Brand Text */}
        <h2 className="font-caslon text-headline-md tracking-[0.2em] text-deep-navy mb-2">
          CAIRO HANGZHOU
        </h2>
        <p className="font-jakarta text-label-sm text-outline tracking-[0.1em] uppercase mb-8">
          Visa & Travel Services
        </p>

        {/* Custom luxury loading bar */}
        <div className="w-48 h-1 bg-sand-beige rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1/2 bg-champagne-gold rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
