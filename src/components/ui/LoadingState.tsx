"use client";

import { cn } from "@/lib/utils";

interface LoadingStateProps {
  variant?: "card" | "table" | "detail";
  count?: number;
  className?: string;
}

export default function LoadingState({ variant = "card", count = 3, className }: LoadingStateProps) {
  if (variant === "table") {
    return (
      <div className={cn("w-full bg-white rounded-xl p-6 shadow-luxury border border-outline-variant/20 animate-pulse", className)}>
        <div className="h-6 w-48 bg-sand-beige rounded-md mb-6" />
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-4 pb-3 border-b border-outline-variant/10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-sand-beige/70 rounded-md" />
            ))}
          </div>
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="grid grid-cols-6 gap-4 py-2">
              <div className="h-4 bg-sand-beige/40 rounded-md w-3/4" />
              <div className="h-4 bg-sand-beige/40 rounded-md" />
              <div className="h-4 bg-sand-beige/40 rounded-md w-5/6" />
              <div className="h-4 bg-sand-beige/40 rounded-md w-1/2" />
              <div className="h-4 bg-sand-beige/40 rounded-md" />
              <div className="h-4 bg-sand-beige/60 rounded-md w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={cn("w-full max-w-[1280px] mx-auto px-5 lg:px-16 py-12 animate-pulse space-y-8", className)}>
        {/* Banner skeleton */}
        <div className="h-64 md:h-[400px] bg-sand-beige rounded-xl" />
        {/* Content split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-sand-beige rounded-md w-1/3" />
            <div className="h-32 bg-sand-beige/40 rounded-xl" />
            <div className="h-32 bg-sand-beige/40 rounded-xl" />
          </div>
          <div className="h-80 bg-sand-beige rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse", className)}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-luxury border border-outline-variant/10 p-5 space-y-4">
          <div className="h-48 bg-sand-beige rounded-xl" />
          <div className="space-y-2">
            <div className="h-6 bg-sand-beige rounded-md w-3/4" />
            <div className="h-4 bg-sand-beige/60 rounded-md w-1/2" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-4 bg-sand-beige rounded-md w-1/4" />
            <div className="h-8 bg-sand-beige rounded-full w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
