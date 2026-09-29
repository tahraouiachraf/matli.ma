import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Mon matériel" };

export default function OwnerEquipmentPage() {
  return (
    <OwnerWorkspace activeHref="/dashboard/equipment">
      <OwnerSectionContent section="materiel" />
    </OwnerWorkspace>
  );
}
