"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error details to console
    console.error("Application crashed:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="assertive">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md bg-white rounded-xl p-8 shadow-luxury-lg border border-outline-variant/20 flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-error mb-6">
          <span className="material-symbols-outlined text-3xl">error_med</span>
        </div>
        <h2 className="font-caslon text-headline-lg text-deep-navy mb-3">Something Went Wrong</h2>
        <p className="font-jakarta text-body-md text-outline mb-8 leading-relaxed">
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={() => reset()}
            className="flex-1 bg-deep-navy text-white font-jakarta font-semibold py-3 px-6 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95 text-sm"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 border border-outline-variant text-deep-navy font-jakarta font-semibold py-3 px-6 rounded-full hover:bg-sand-beige transition-all duration-300 text-sm flex items-center justify-center"
          >
            Go to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
