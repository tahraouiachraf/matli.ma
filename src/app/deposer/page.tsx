import type { Metadata } from "next";
import { DepositSection } from "@/components/sections/DepositSection";

export const metadata: Metadata = {
  title: "Déposer un matériel",
  description: "Publiez votre JCB, pelle, chargeuse ou nacelle sur MATLI et recevez des demandes de location.",
};

export default function DepositPage() {
  return <DepositSection />;
}
