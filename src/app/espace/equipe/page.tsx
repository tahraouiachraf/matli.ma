import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Équipe" };

export default function OwnerTeamPage() {
  return (
    <OwnerWorkspace activeHref="/espace/equipe">
      <OwnerSectionContent section="equipe" />
    </OwnerWorkspace>
  );
}
