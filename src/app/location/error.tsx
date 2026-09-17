"use client";

import { ErrorState } from "@/components/errors/ErrorState";

export default function LocationError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorState
      code="500"
      digest={error.digest}
      reportedError={error}
      eyebrow="Chargement indisponible"
      icon="dns"
      onRetry={reset}
      title="Merci de réessayer plus tard"
      description="Nous n'arrivons pas à afficher les machines pour le moment. Réessayez dans quelques instants."
      tone="red"
    />
  );
}
