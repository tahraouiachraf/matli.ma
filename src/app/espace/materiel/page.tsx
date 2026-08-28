import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Mon matériel" };

export default function OwnerEquipmentPage() {
  return (
    <OwnerWorkspace activeHref="/espace/materiel">
      <OwnerSectionContent section="materiel" />
    </OwnerWorkspace>
  );
}
