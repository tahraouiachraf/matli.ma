import { CategoryGrid } from "@/components/marketplace/CategoryGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function MachinesSection() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Machines"
        title="Quel type de machine voulez-vous louer ?"
        description="Une taxonomie simple pour les besoins terrain: terrassement, levage, manutention, travaux publics et chargement. Chaque catégorie pourra ensuite recevoir ses propres filtres API."
      />
      <div className="mt-10">
        <CategoryGrid />
      </div>
    </section>
  );
}
