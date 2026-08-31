import { ErrorState } from "@/components/errors/ErrorState";

export default function NotFound() {
  return (
    <ErrorState
      code="404"
      eyebrow="Page introuvable"
      title="Cette page n’existe pas"
      description="Le lien demandé est incorrect, expiré ou la page a été déplacée. Vous pouvez revenir à l’accueil ou consulter les machines disponibles."
      icon="notFound"
    />
  );
}
