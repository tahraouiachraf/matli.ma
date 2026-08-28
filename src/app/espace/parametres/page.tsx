import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Paramètres" };

export default function OwnerSettingsPage() {
  return (
    <OwnerWorkspace activeHref="/espace/parametres">
      <OwnerSectionContent section="parametres" />
    </OwnerWorkspace>
  );
}
