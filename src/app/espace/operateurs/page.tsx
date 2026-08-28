import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Opérateurs" };

export default function OwnerOperatorsPage() {
  return (
    <OwnerWorkspace activeHref="/espace/operateurs">
      <OwnerSectionContent section="operateurs" />
    </OwnerWorkspace>
  );
}
