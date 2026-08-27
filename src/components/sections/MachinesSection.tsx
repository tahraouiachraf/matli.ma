import { CategoryGrid } from "@/components/marketplace/CategoryGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function MachinesSection() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Machines JCB"
        title="Quel type de machine voulez-vous louer ?"
        description="Sélection de machines demandées sur les chantiers marocains: tracteurs, mini-pelles, telescopic, pelles sur chenilles et chargeuses."
      />
      <div className="mt-10">
        <CategoryGrid />
      </div>
    </section>
  );
}
