import type { Metadata } from "next";
import { CircleHelp, FileCheck2, Headphones, RefreshCw } from "lucide-react";
import { SupportForm } from "@/components/support/SupportForm";

export const metadata: Metadata = {
  title: "Aide et support | MATLI.ma",
  description: "Trouvez une réponse ou ouvrez un dossier auprès du support MATLI pour une location, un paiement, un litige ou un remboursement.",
  alternates: { canonical: "/help" },
};

const clientFaq = [
  ["Comment réserver une machine ?", "Choisissez une machine disponible, sélectionnez vos dates puis envoyez la demande. Le propriétaire confirme ou refuse depuis son espace."],
  ["Quand ma réservation est-elle garantie ?", "La réservation est garantie lorsque son statut passe à Confirmée. Les dates sont alors bloquées dans le calendrier."],
  ["Comment annuler ?", "Ouvrez Mes locations, sélectionnez la réservation concernée et utilisez l’action d’annulation lorsque son statut le permet."],
];

const ownerFaq = [
  ["Comment améliorer la visibilité d’une annonce ?", "Ajoutez au moins trois photos récentes, une description détaillée, les caractéristiques techniques, un prix actuel et une disponibilité exacte."],
  ["Comment répondre à une demande ?", "Depuis Locations, ouvrez la demande puis confirmez-la ou refusez-la. La décision est horodatée et le client est notifié."],
  ["Pourquoi une annonce est-elle désactivée ?", "Une annonce peut être bloquée par l’administration ou désactivée après une longue période sans actualisation. Vous pouvez la mettre à jour puis la réactiver."],
];

export default function HelpPage() {
  return (
    <main className="bg-white pb-20 pt-6 sm:pt-10">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 px-5 py-10 text-white sm:px-10 sm:py-14">
          <p className="text-sm font-black uppercase tracking-widest text-orange-400">Centre d’aide MATLI</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">Une réponse claire, avec un dossier réellement suivi.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-300">Consultez les réponses essentielles ou contactez-nous pour une réservation, un paiement, un litige ou un remboursement.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {[[CircleHelp, "Réponses rapides", "FAQ séparée pour clients et propriétaires."], [FileCheck2, "Dossier numéroté", "Une référence unique dès l’envoi."], [Headphones, "Suivi humain", "Traitement visible dans le portail MATLI."], [RefreshCw, "Litige et remboursement", "Une procédure documentée et équitable."]].map(([Icon, title, text]) => {
          const CardIcon = Icon as typeof CircleHelp;
          return <div key={String(title)} className="rounded-2xl border border-neutral-200 bg-white p-5"><CardIcon className="size-6 text-orange-500" aria-hidden /><h2 className="mt-4 font-black">{String(title)}</h2><p className="mt-2 text-sm leading-6 text-neutral-600">{String(text)}</p></div>;
        })}
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Faq title="Questions clients" items={clientFaq} />
        <Faq title="Questions propriétaires" items={ownerFaq} />
      </section>

      <section id="litiges" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-widest text-orange-800">Litige et remboursement</p>
          <h2 className="mt-2 text-2xl font-black">Une procédure en quatre étapes</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {["Ouvrez un dossier avec la référence de réservation.", "Ajoutez les faits, dates et justificatifs utiles.", "MATLI examine les échanges des deux parties.", "La décision et les prochaines actions sont communiquées par email."].map((step, index) => <li key={step} className="rounded-xl bg-white p-4 text-sm leading-6"><span className="mb-3 block font-black text-orange-800">0{index + 1}</span>{step}</li>)}
          </ol>
          <p className="mt-5 text-sm leading-6 text-neutral-600">N’envoyez jamais de données bancaires complètes dans le formulaire. Le délai et l’éligibilité d’un remboursement dépendent du statut de la réservation et de la politique d’annulation acceptée.</p>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-6 text-center"><p className="text-sm font-black uppercase tracking-widest text-orange-800">Nous contacter</p><h2 className="mt-2 text-3xl font-black">Ouvrir un dossier support</h2><p className="mt-3 text-neutral-600">Décrivez précisément votre demande. Une référence vous sera remise immédiatement.</p></div>
        <SupportForm />
      </section>
    </main>
  );
}

function Faq({ title, items }: { title: string; items: string[][] }) {
  return <div><h2 className="text-2xl font-black">{title}</h2><div className="mt-5 grid gap-3">{items.map(([question, answer]) => <details key={question} className="group rounded-xl border border-neutral-200 bg-white p-4"><summary className="cursor-pointer list-none pr-6 font-black marker:hidden">{question}</summary><p className="mt-3 text-sm leading-6 text-neutral-600">{answer}</p></details>)}</div></div>;
}
