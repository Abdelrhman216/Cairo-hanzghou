"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Destination } from "@/lib/data";

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function DestinationCard({ destination, index }: DestinationCardProps) {
  return (
    <motion.div variants={fadeUp} custom={index}>
      <Link
        href={`/packages?destination=${destination.countryCode}`}
        className="block w-72 lg:w-80 group cursor-pointer"
        aria-label={`Explore ${destination.name} in ${destination.location}`}
      >
        <div className="relative h-96 lg:h-[440px] rounded-xl overflow-hidden mb-4 shadow-luxury-md">
          <Image
            src={destination.image}
            alt={`${destination.name} — ${destination.location}`}
            fill
            sizes="(max-w-1024px) 288px, 320px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-card-gradient" />
          <div className="absolute bottom-6 left-6 right-6 text-white z-10">
            <span
              className={cn(
                "px-3 py-1 rounded text-label-sm font-bold uppercase tracking-wider mb-3 inline-block",
                destination.categoryStyle === "gold"
                  ? "bg-champagne-gold text-deep-navy"
                  : "bg-white/20 backdrop-blur-md text-white"
              )}
            >
              {destination.category}
            </span>
            <h3 className="font-caslon text-headline-md text-white">{destination.name}</h3>
            <p className="font-jakarta text-label-sm text-white/70 mt-1">{destination.location}</p>
          </div>
          {/* Rating badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded flex items-center gap-1.5 shadow-luxury z-10">
            <span className="material-symbols-outlined text-champagne-gold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="font-jakarta font-bold text-xs text-deep-navy">{destination.rating}</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-1">
          <p className="font-jakarta text-label-sm text-outline">{destination.duration}</p>
          <p className="font-jakarta font-bold text-label-lg text-champagne-gold">{destination.price}</p>
        </div>
      </Link>
    </motion.div>
  );
}
