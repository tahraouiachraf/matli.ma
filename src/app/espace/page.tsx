import type { Metadata } from "next";
import { DashboardHome, OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";

export const metadata: Metadata = {
  title: "Mon espace",
  description: "Espace MATLI personnalisé pour suivre les locations ou gérer un parc de matériel BTP.",
};

export default function OwnerSpacePage() {
  return (
    <OwnerWorkspace activeHref="/dashboard">
      <DashboardHome />
    </OwnerWorkspace>
  );
}
