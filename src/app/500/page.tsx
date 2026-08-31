import { ErrorState } from "@/components/errors/ErrorState";

export default function ServerErrorPage() {
  return (
    <ErrorState
      code="500"
      eyebrow="Erreur serveur"
      title="Le service rencontre un problème"
      description="Une erreur technique empêche le traitement de la demande. Notre équipe pourra consulter les journaux de suivi pour corriger le problème."
      icon="server"
      tone="red"
    />
  );
}
