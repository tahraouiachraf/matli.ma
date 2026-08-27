import type { Metadata } from "next";
import { ClientDemandSection } from "@/components/sections/ClientDemandSection";
import { MachinesSection } from "@/components/sections/MachinesSection";

export const metadata: Metadata = {
  title: "Machines JCB à louer",
  description: "Tracteurs, mini-pelles, telescopic, pelles sur chenilles et chargeuses JCB à louer au Maroc.",
};

export default function MachinesJcbPage() {
  return (
    <>
      <MachinesSection />
      <ClientDemandSection />
    </>
  );
}
