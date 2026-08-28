import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Locations" };

export default function OwnerRentalsPage() {
  return (
    <OwnerWorkspace activeHref="/espace/locations">
      <OwnerSectionContent section="locations" />
    </OwnerWorkspace>
  );
}
