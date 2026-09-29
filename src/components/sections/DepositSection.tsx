import { CheckCircle2, ClipboardList, MessageSquareText, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function DepositSection() {
  return (
    <section id="deposer" className="bg-neutral-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Déposer un matériel"
            title="Publiez votre machine comme une vraie annonce professionnelle."
            description="Photos, prix, ville, disponibilité, opérateur, livraison, documents et maintenance: MATLI prépare l&apos;interface qui permettra ensuite de gérer tout le cycle de location."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              [ClipboardList, "1. Déposer", "Machine, marque, année, photos et prix."],
              [MessageSquareText, "2. Recevoir", "Demandes qualifiées avec budget et durée."],
              [Truck, "3. Louer", "Confirmation, livraison, opérateur et suivi."],
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="rounded-md border border-neutral-200 bg-white p-4">
                <Icon className="text-orange-500" size={22} aria-hidden />
                <h3 className="mt-3 font-black">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{text as string}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/list-equipment">Déposer une machine</ButtonLink>
          </div>
        </div>
        <div className="animate-soft-float rounded-md border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-950/10">
          <div
            className="h-64 rounded-md bg-cover bg-center sm:h-80"
            style={{
              backgroundImage:
                "url(/equipment/jcb-3cx-yard.jpg)",
            }}
          />
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-orange-600">Exemple d&apos;annonce</p>
              <h3 className="mt-1 text-2xl font-black">JCB 3CX à louer à Casablanca</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Tractopelle avec opérateur disponible, livraison possible, prix à partir de 1 700 DH / jour.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm font-black text-green-700">
              <CheckCircle2 size={17} aria-hidden />
              Disponible
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Ville", "Prix / jour", "Contact client"].map((label, index) => (
              <div key={label} className="rounded-md bg-neutral-50 p-3">
                <p className="text-xs font-bold uppercase text-neutral-500">{label}</p>
                <p className="mt-1 font-black">{["Casablanca", "1 700 DH", "WhatsApp / appel"][index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
