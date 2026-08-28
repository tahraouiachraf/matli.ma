import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RentalHistorySection } from "@/components/sections/RentalHistorySection";

export const metadata: Metadata = {
  title: "Mes locations",
  description: "Historique des machines louées, réservations, factures et actions rapides MATLI.",
};

export default function MyRentalsPage() {
  return (
    <AuthGuard title="Connectez-vous pour consulter vos locations">
      <RentalHistorySection />
    </AuthGuard>
  );
}
