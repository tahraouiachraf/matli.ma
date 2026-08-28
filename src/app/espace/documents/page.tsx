import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Documents" };

export default function OwnerDocumentsPage() {
  return (
    <OwnerWorkspace activeHref="/espace/documents">
      <OwnerSectionContent section="documents" />
    </OwnerWorkspace>
  );
}
