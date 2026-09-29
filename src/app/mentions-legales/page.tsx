import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Mentions légales", description: "Informations légales relatives à MATLI.ma.", alternates: { canonical: "/legal-notice" } };

export default function LegalNoticePage() {
  return <LegalPage title="Mentions légales" intro="Informations relatives à l’édition et à l’exploitation de la plateforme MATLI.ma.">
    <LegalSection title="Éditeur"><p>MATLI.ma, marketplace marocaine de location de matériel BTP. Contact: contact@matli.ma. Les informations d’immatriculation et l’adresse du siège doivent être complétées avant l’ouverture commerciale.</p></LegalSection>
    <LegalSection title="Hébergement"><p>Les coordonnées complètes de l’hébergeur de production doivent être reportées ici avant le lancement officiel.</p></LegalSection>
    <LegalSection title="Propriété intellectuelle"><p>La marque, l’interface et les contenus MATLI sont protégés. Les propriétaires garantissent disposer des droits nécessaires sur les photos et descriptions qu’ils publient.</p></LegalSection>
    <LegalSection title="Contact"><p>Pour toute question légale, demande liée aux données ou signalement, écrivez à contact@matli.ma.</p></LegalSection>
  </LegalPage>;
}
