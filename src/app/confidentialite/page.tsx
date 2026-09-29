import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { CookieSettingsButton } from "@/components/legal/CookieSettingsButton";

export const metadata: Metadata = { title: "Politique de confidentialité", description: "Traitement et protection des données personnelles sur MATLI.ma.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <LegalPage title="Politique de confidentialité" intro="MATLI limite la collecte aux données nécessaires à la gestion des comptes, annonces, réservations et échanges de service.">
    <LegalSection title="Données traitées"><p>Nous traitons notamment l’identité, les coordonnées, les informations d’entreprise, les annonces, les réservations, les journaux de sécurité et les préférences de consentement.</p></LegalSection>
    <LegalSection title="Finalités et conservation"><p>Ces données servent à fournir la plateforme, sécuriser les accès, envoyer les notifications et respecter nos obligations. Elles sont conservées pendant la durée nécessaire à ces finalités et aux obligations légales.</p></LegalSection>
    <LegalSection title="Cookies et mesure d’audience"><p>Les cookies nécessaires assurent le fonctionnement du service. Google Analytics n’est chargé qu’après votre accord explicite dans le bandeau de consentement.</p><CookieSettingsButton /></LegalSection>
    <LegalSection title="Vos droits"><p>Vous pouvez demander l’accès, la correction ou la suppression de vos données en écrivant à contact@matli.ma. Certaines données peuvent être conservées lorsqu’une obligation légale l’exige.</p></LegalSection>
  </LegalPage>;
}
