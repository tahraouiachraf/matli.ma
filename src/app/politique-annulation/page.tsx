import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Politique d’annulation", description: "Règles d’annulation des réservations de matériel sur MATLI.ma.", alternates: { canonical: "/politique-annulation" } };

export default function CancellationPage() {
  return <LegalPage title="Politique d’annulation" intro="Les conditions financières précises sont présentées avant confirmation et peuvent dépendre du propriétaire, de la machine et des services commandés.">
    <LegalSection title="Demande en attente"><p>Le locataire peut annuler une demande qui n’a pas encore été confirmée. Aucun paiement ne doit être demandé avant confirmation des conditions.</p></LegalSection>
    <LegalSection title="Réservation confirmée"><p>L’annulation reste possible depuis l’espace client jusqu’au démarrage, sous réserve des conditions récapitulées lors de la confirmation. Le propriétaire et le locataire reçoivent une notification.</p></LegalSection>
    <LegalSection title="Indisponibilité du matériel"><p>Si le propriétaire ne peut pas fournir la machine confirmée, il doit annuler rapidement et informer le locataire. MATLI conserve l’historique de ce changement.</p></LegalSection>
    <LegalSection title="Litiges"><p>Conservez les échanges, devis et justificatifs. Contactez MATLI en cas de désaccord afin de faciliter l’examen du dossier.</p></LegalSection>
  </LegalPage>;
}
