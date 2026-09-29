import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Maintenance" };

export default function OwnerMaintenancePage() {
  return (
    <OwnerWorkspace activeHref="/dashboard/maintenance">
      <OwnerSectionContent section="maintenance" />
    </OwnerWorkspace>
  );
}
