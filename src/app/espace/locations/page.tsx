import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Locations" };

export default function OwnerRentalsPage() {
  return (
    <OwnerWorkspace activeHref="/dashboard/rentals">
      <OwnerSectionContent section="locations" />
    </OwnerWorkspace>
  );
}
