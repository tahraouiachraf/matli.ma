import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Finances" };

export default function OwnerFinancePage() {
  return (
    <OwnerWorkspace activeHref="/espace/finances">
      <OwnerSectionContent section="finances" />
    </OwnerWorkspace>
  );
}
