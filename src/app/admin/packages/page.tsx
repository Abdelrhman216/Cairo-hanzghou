"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatEGP } from "@/lib/currency";
import type { TravelPackage } from "@/lib/data";

import { getPackages, updateCmsPackage, deletePackage } from "@/services/packages";

export default function PackageInventoryPage() {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPackages = async () => {
    setLoading(true);
    const data = await getPackages();
    setPackages(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const updatePackage = async (id: string, patch: Partial<TravelPackage> & Record<string, any>) => {
    await updateCmsPackage(id, patch);
    await loadPackages();
  };

  const editPackage = async (pkg: TravelPackage) => {
    const title = window.prompt("Package name", pkg.title);
    if (!title) return;
    const priceInput = window.prompt("Package price", String(pkg.price));
    const price = Number(priceInput);
    await updatePackage(pkg.id, {
      title,
      price: Number.isFinite(price) ? price : pkg.price,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-caslon text-headline-lg text-deep-navy">Package Inventory</h1>
          <p className="font-jakarta text-body-md text-outline mt-1">Manage all travel packages and availability</p>
        </div>
        <button className="bg-deep-navy text-white font-jakarta font-bold px-6 py-3 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span> New Package
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-xl shadow-luxury p-8 font-jakarta text-outline">
          Loading package inventory...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-luxury overflow-hidden hover:shadow-luxury-md transition-all duration-300"
          >
            <div className="relative h-40">
              <Image
                src={pkg.image}
                alt={`Cover image for ${pkg.title}`}
                fill
                sizes="(max-w-768px) 100vw, 500px"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-deep-navy/40 z-10" />
              <div className="absolute top-3 left-3 z-20">
                <span className={cn("px-3 py-1 rounded-full text-label-sm font-bold", pkg.tagColor === "gold" ? "bg-champagne-gold text-deep-navy" : "bg-white/20 text-white")}>
                  {pkg.tag}
                </span>
              </div>
              <div className="absolute top-3 right-3 flex gap-2 z-20">
                <button onClick={() => editPackage(pkg)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white" aria-label="Edit package">
                  <span className="material-symbols-outlined text-deep-navy text-sm">edit</span>
                </button>
                <button className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white" aria-label="Delete package">
                  <span className="material-symbols-outlined text-error text-sm">delete</span>
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-caslon text-headline-md text-deep-navy">{pkg.title}</h2>
                  <p className="font-jakarta text-label-sm text-outline">{pkg.destinationLabel} · {pkg.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-caslon text-headline-md text-champagne-gold">{formatEGP(pkg.price)}</p>
                  <p className="font-jakarta text-label-sm text-outline line-through">{formatEGP(pkg.originalPrice)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-champagne-gold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-jakarta font-bold text-sm text-deep-navy">{pkg.rating}</span>
                  <span className="font-jakarta text-label-sm text-outline">({pkg.reviews} reviews)</span>
                </div>
                <button
                  onClick={() => updatePackage(pkg.id, { active: (pkg as any).active === false })}
                  className="flex items-center gap-2 cursor-pointer"
                  aria-label="Toggle package availability"
                >
                  <span className="font-jakarta text-label-sm text-outline">{(pkg as any).active === false ? "Inactive" : "Active"}</span>
                  <div className={cn("w-10 h-5 rounded-full relative", (pkg as any).active === false ? "bg-outline-variant" : "bg-champagne-gold")}>
                    <div className={cn("w-4 h-4 bg-white rounded-full absolute top-0.5", (pkg as any).active === false ? "left-0.5" : "right-0.5")} />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
