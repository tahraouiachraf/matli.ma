import { ErrorState } from "@/components/errors/ErrorState";

export default function BackendUnavailablePage() {
  return (
    <ErrorState
      code="503"
      eyebrow="Service momentanément indisponible"
      title="Merci de réessayer plus tard"
      description="Nous n'arrivons pas à afficher ces informations pour le moment. Notre équipe suit la situation et vous pouvez réessayer dans quelques instants."
      icon="dns"
      tone="red"
    />
  );
}
