import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getCmsItem, getPackages } from "@/lib/server-store";
import type { TravelPackage } from "@/lib/data";
import PackageDetailClient from "./PackageDetailClient";

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const pkg = await getCmsItem<TravelPackage>("packages", resolvedParams.slug);
  if (!pkg) return {};
  
  return {
    title: `${pkg.title} | Cairo Hangzhou`,
    description: `${pkg.subtitle}. Experience custom luxury itineraries, 5-star accommodations, and premium services with Cairo Hangzhou.`,
    openGraph: {
      title: `${pkg.title} | Cairo Hangzhou`,
      description: pkg.subtitle,
      images: [{ url: pkg.image }],
    },
  };
}

export default async function Page({ params }: Props) {
  await connection();
  const resolvedParams = await params;
  const pkg = await getCmsItem<TravelPackage>("packages", resolvedParams.slug);
  if (!pkg) notFound();
  
  return <PackageDetailClient pkg={pkg} />;
}
export async function generateStaticParams() {
  try {
    const pkgs = await getPackages();
    return pkgs.map((pkg) => ({
      slug: pkg.id,
    }));
  } catch (e) {
    console.error("Failed to generate static params for packages:", e);
    return [];
  }
}
