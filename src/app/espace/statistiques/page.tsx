import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Statistiques" };

export default function OwnerStatsPage() {
  return (
    <OwnerWorkspace activeHref="/espace/statistiques">
      <OwnerSectionContent section="statistiques" />
    </OwnerWorkspace>
  );
}
