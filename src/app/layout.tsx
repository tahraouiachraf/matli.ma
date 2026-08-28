import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AuthProvider } from "@/components/providers/AuthProvider";
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
  metadataBase: new URL("https://matli.ma"),
  title: {
    default: "Location de matériel BTP et engins au Maroc | MATLI",
    template: "%s | MATLI",
  },
  description:
    "Trouvez des engins et machines professionnelles disponibles à la location partout au Maroc. Tractopelles, mini-pelles, chariots télescopiques, chargeuses et plus.",
  openGraph: {
    title: "MATLI.ma",
    description: "Louez. Gérez. Rentabilisez votre matériel.",
    url: "https://matli.ma",
    siteName: "MATLI",
    locale: "fr_MA",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-neutral-50 text-neutral-950">
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
