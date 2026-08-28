import type { Metadata } from "next";
import { ClientDemandSection } from "@/components/sections/ClientDemandSection";
import { MachinesSection } from "@/components/sections/MachinesSection";

export const metadata: Metadata = {
  title: "Machines à louer",
  description: "Tractopelles, mini-pelles, chariots télescopiques, pelles sur chenilles et chargeuses à louer au Maroc.",
};

export default function MachinesPage() {
  return (
    <>
      <MachinesSection />
      <ClientDemandSection />
    </>
  );
}
