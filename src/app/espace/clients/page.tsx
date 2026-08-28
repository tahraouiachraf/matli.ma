import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Clients" };

export default function OwnerClientsPage() {
  return (
    <OwnerWorkspace activeHref="/espace/clients">
      <OwnerSectionContent section="clients" />
    </OwnerWorkspace>
  );
}
