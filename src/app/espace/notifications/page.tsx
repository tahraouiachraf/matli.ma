import type { Metadata } from "next";
import { OwnerSectionContent, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = { title: "Notifications" };

export default function OwnerNotificationsPage() {
  return (
    <OwnerWorkspace activeHref="/espace/notifications">
      <OwnerSectionContent section="notifications" />
    </OwnerWorkspace>
  );
}
