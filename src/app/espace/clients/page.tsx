import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Clients" };

export default function OwnerClientsPage() {
  return (
    <OwnerWorkspace activeHref="/dashboard/clients">
      <OwnerSectionContent section="clients" />
    </OwnerWorkspace>
  );
}
