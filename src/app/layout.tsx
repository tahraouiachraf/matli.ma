import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AuthProvider } from "@/components/providers/AuthProvider";
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
    "location tractopelle Maroc",
    "location mini pelle Maroc",
    "location JCB Maroc",
    "engins chantier Maroc",
    "machines BTP Casablanca",
    "location chariot télescopique",
    "location chargeuse",
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
        url: "/equipment/jcb-3cx-yard.jpg",
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
    images: ["/equipment/jcb-3cx-yard.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-neutral-50 text-neutral-950">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-1CYERG8JGX" strategy="lazyOnload" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1CYERG8JGX');
          `}
        </Script>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
