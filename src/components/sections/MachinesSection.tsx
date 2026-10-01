import { CategoryGrid } from "@/components/marketplace/CategoryGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories as fallbackCategories } from "@/lib/data";
import { getCategoriesStrict } from "@/services/api/matli";

export async function MachinesSection() {
  const categories = await getCategoriesStrict().catch(() => fallbackCategories);

  return (
    <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Machines"
        title="Quel type de machine voulez-vous louer ?"
        description="Choisissez la catégorie adaptée à votre chantier, puis comparez les modèles, les tarifs, les options et les disponibilités près de chez vous."
      />
      <div className="mt-10">
        <CategoryGrid items={categories} />
      </div>
    </section>
  );
}
