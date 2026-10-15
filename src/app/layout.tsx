import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AnalyticsConsent } from "@/components/providers/AnalyticsConsent";
import { JsonLd, organizationJsonLd, siteDescription, siteName, siteUrl, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "marketplace",
  keywords: [
    "location matériel BTP Maroc",
    "location matériel de BTP Maroc",
    "localisation matériel BTP Maroc",
    "location matériel BTP près de moi",
    "matériel BTP Maroc",
    "matériel de chantier Maroc",
    "BTP Maroc",
    "location engins BTP Maroc",
    "location tractopelle Maroc",
    "location mini pelle Maroc",
    "location mini-pelle Maroc",
    "location JCB Maroc",
    "location JCB 3CX Maroc",
    "JCB 3CX location",
    "engins chantier Maroc",
    "machines BTP Casablanca",
    "location chariot télescopique",
    "location telescopic Maroc",
    "location télescopique Maroc",
    "location chargeuse",
    "location chargeuse Maroc",
  ],
  title: {
    default: "Location de matériel BTP et engins au Maroc | MATLI",
    template: "%s | MATLI",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
    languages: {
      "fr-MA": "/",
      fr: "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "MATLI.ma - Location de matériel BTP au Maroc",
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "fr_MA",
    type: "website",
    images: [
      {
        url: "/matli-thumbnail-v2.jpg",
        width: 1200,
        height: 630,
        alt: "Location de machines BTP au Maroc avec MATLI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MATLI.ma - Location de matériel BTP au Maroc",
    description: siteDescription,
    images: ["/matli-thumbnail-v2.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full bg-white text-neutral-950">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <AuthProvider>
          <Header />
          <main className="pt-2 sm:pt-3">{children}</main>
          <Footer />
          <MobileBottomNav />
          <AnalyticsConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
