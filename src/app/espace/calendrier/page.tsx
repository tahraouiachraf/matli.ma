import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Calendrier" };

export default function OwnerCalendarPage() {
  return (
    <OwnerWorkspace activeHref="/dashboard/calendar">
      <OwnerSectionContent section="calendrier" />
    </OwnerWorkspace>
  );
}
