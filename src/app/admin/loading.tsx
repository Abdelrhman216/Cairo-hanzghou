"use client";

export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Loading Admin Dashboard">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-sand-beige rounded-md w-32 mb-2" />
          <div className="h-8 bg-sand-beige rounded-md w-64" />
        </div>
        <div className="h-12 bg-sand-beige rounded-full w-36" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-luxury space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-sand-beige rounded-xl" />
              <div className="h-5 bg-sand-beige rounded-md w-12" />
            </div>
            <div className="h-8 bg-sand-beige rounded-md w-24" />
            <div className="h-4 bg-sand-beige rounded-md w-16" />
          </div>
        ))}
      </div>

      {/* Table Section Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-luxury space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
          <div className="h-6 bg-sand-beige rounded-md w-40" />
          <div className="h-10 bg-sand-beige rounded-xl w-32" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <div className="h-4 bg-sand-beige/70 rounded-md w-16" />
              <div className="h-4 bg-sand-beige/70 rounded-md flex-1" />
              <div className="h-4 bg-sand-beige/70 rounded-md w-24" />
              <div className="h-4 bg-sand-beige/70 rounded-md w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
