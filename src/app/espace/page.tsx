import type { Metadata } from "next";
import { DashboardHome, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = {
  title: "Espace propriétaire",
  description: "Dashboard propriétaire pour gérer matériel, locations, maintenance, clients et finances.",
};

export default function OwnerSpacePage() {
  return (
    <OwnerWorkspace activeHref="/espace">
      <DashboardHome />
    </OwnerWorkspace>
  );
}
