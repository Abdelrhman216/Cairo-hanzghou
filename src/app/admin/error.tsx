"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin portal page crashed:", error);
  }, [error]);

  return (
    <div className="bg-white rounded-xl p-8 shadow-luxury border border-outline-variant/20 flex flex-col items-center text-center max-w-lg mx-auto my-12" role="alert">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-error mb-6">
        <span className="material-symbols-outlined text-3xl">report</span>
      </div>
      <h2 className="font-caslon text-headline-lg text-deep-navy mb-2">Admin View Error</h2>
      <p className="font-jakarta text-body-md text-outline mb-6 leading-relaxed">
        Failed to load this dashboard section. Please check your connection or try resetting this section.
      </p>
      <div className="flex gap-3 w-full">
        <button
          onClick={() => reset()}
          className="flex-1 bg-deep-navy text-white font-jakarta font-semibold py-3 px-6 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 active:scale-95 text-sm"
        >
          Reload Dashboard View
        </button>
      </div>
    </div>
  );
}
