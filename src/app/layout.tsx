import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cairohangzhou.com"),
  title: {
    default: "Cairo Hangzhou | Global Visa & Travel Services",
    template: "%s | Cairo Hangzhou",
  },
  description:
    "Cairo Hangzhou is your premier global visa consultancy and luxury travel services provider — offering bespoke flights, hotels, tour packages, visa processing, business travel, education abroad, and translation services for any country worldwide.",
  keywords: [
    "Cairo Hangzhou",
    "luxury travel",
    "visa consultancy",
    "global travel agency",
    "international visa services",
    "business travel",
    "education abroad",
    "document translation",
    "worldwide flights",
    "hotel booking",
    "tour packages",
    "195 countries",
    "Schengen visa",
    "US visa",
    "UK visa",
    "Japan visa",
    "China visa",
  ],
  authors: [{ name: "Cairo Hangzhou" }],
  creator: "Cairo Hangzhou",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cairohangzhou.com",
    siteName: "Cairo Hangzhou",
    title: "Cairo Hangzhou | Global Visa & Travel Services",
    description:
      "Your world, curated. Expert visa consultancy, luxury travel, and global services for 195+ countries — powered by Cairo Hangzhou.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cairo Hangzhou — Global Visa & Travel Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cairo Hangzhou | Global Visa & Travel Services",
    description:
      "Expert visa consultancy and luxury travel for 195+ countries. Your world, curated.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

import { cookies } from "next/headers";
import { I18nProvider } from "@/components/layout/I18nProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface antialiased font-jakarta min-h-screen">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
