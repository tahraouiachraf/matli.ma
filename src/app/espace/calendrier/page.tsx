import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Calendrier" };

export default function OwnerCalendarPage() {
  return (
    <OwnerWorkspace activeHref="/espace/calendrier">
      <OwnerSectionContent section="calendrier" />
    </OwnerWorkspace>
  );
}
