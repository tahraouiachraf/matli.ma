import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Demandes" };

export default function OwnerRequestsPage() {
  return (
    <OwnerWorkspace activeHref="/espace/demandes">
      <OwnerSectionContent section="demandes" />
    </OwnerWorkspace>
  );
}
