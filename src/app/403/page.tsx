import { ErrorState } from "@/components/errors/ErrorState";

export default function ForbiddenPage() {
  return (
    <ErrorState
      code="403"
      eyebrow="Accès refusé"
      title="Vous n’avez pas accès à cette page"
      description="Cette zone est réservée à un compte autorisé. Connectez-vous avec un profil propriétaire, client ou administrateur selon l’espace demandé."
      icon="forbidden"
      tone="neutral"
    />
  );
}
