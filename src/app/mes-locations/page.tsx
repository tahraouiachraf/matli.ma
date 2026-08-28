import type { Metadata } from "next";
import { RentalHistorySection } from "@/components/sections/RentalHistorySection";

export const metadata: Metadata = {
  title: "Mes locations",
  description: "Historique des machines louées, réservations, factures et actions rapides MATLI.",
};

export default function MyRentalsPage() {
  return <RentalHistorySection />;
}
