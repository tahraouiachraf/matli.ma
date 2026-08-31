import { ErrorState } from "@/components/errors/ErrorState";

export default function BadRequestPage() {
  return (
    <ErrorState
      code="400"
      eyebrow="Requête incorrecte"
      title="La demande n’est pas valide"
      description="Certains paramètres envoyés à MATLI sont incomplets ou incorrects. Vérifiez votre recherche ou revenez à la page précédente."
      icon="badRequest"
    />
  );
}
