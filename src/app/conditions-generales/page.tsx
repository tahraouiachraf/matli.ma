import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Conditions générales d’utilisation", description: "Conditions d’utilisation de la marketplace MATLI.ma.", alternates: { canonical: "/conditions-generales" } };

export default function TermsPage() {
  return <LegalPage title="Conditions générales d’utilisation" intro="Ces conditions encadrent l’accès à MATLI.ma et la mise en relation entre locataires et propriétaires de matériel BTP.">
    <LegalSection title="Rôle de MATLI"><p>MATLI fournit une marketplace de mise en relation. Le contrat de location est conclu entre le propriétaire et le locataire, qui restent responsables des informations, prix, assurances et obligations convenus.</p></LegalSection>
    <LegalSection title="Comptes et annonces"><p>Chaque utilisateur fournit des informations exactes, protège ses accès et signale tout usage non autorisé. Les annonces doivent décrire fidèlement le matériel, son prix, sa disponibilité et ses conditions.</p></LegalSection>
    <LegalSection title="Réservations"><p>Une demande reste en attente jusqu’à sa confirmation par le propriétaire. Les dates confirmées sont bloquées. Toute modification ou annulation apparaît dans l’historique horodaté de la réservation.</p></LegalSection>
    <LegalSection title="Comportements interdits"><p>La fraude, les annonces trompeuses, le contournement des protections, l’usurpation d’identité et les contenus illicites peuvent entraîner une suspension immédiate.</p></LegalSection>
  </LegalPage>;
}
