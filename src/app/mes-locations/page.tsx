import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";
import { RentalHistorySection } from "@/components/sections/RentalHistorySection";

export const metadata: Metadata = {
  title: "Mes locations",
  description: "Suivi des locations, réservations et historiques de statut sur MATLI.",
};

export default function MyRentalsPage() {
  return (
    <AuthGuard title="Connectez-vous pour consulter vos locations">
      <OwnerWorkspace activeHref="/my-rentals">
        <RentalHistorySection embedded />
      </OwnerWorkspace>
    </AuthGuard>
  );
}
