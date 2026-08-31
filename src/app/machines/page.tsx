import type { Metadata } from "next";
import { ClientDemandSection } from "@/components/sections/ClientDemandSection";
import { MachinesSection } from "@/components/sections/MachinesSection";

export const metadata: Metadata = {
  title: "Machines BTP à louer au Maroc",
  description: "Tractopelles, mini-pelles, chariots télescopiques, pelles sur chenilles et chargeuses à louer au Maroc.",
  alternates: {
    canonical: "/machines",
  },
  openGraph: {
    title: "Machines BTP à louer au Maroc | MATLI",
    description: "Découvrez les principales catégories de machines BTP disponibles à la location au Maroc.",
    url: "/machines",
    images: ["/equipment/jcb-excavator-quarry.png"],
  },
};

export default function MachinesPage() {
  return (
    <>
      <MachinesSection />
      <ClientDemandSection />
    </>
  );
}
