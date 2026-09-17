"use client";

import { ErrorState } from "@/components/errors/ErrorState";

export default function OwnerSpaceError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorState
      code="500"
      digest={error.digest}
      reportedError={error}
      eyebrow="Dashboard indisponible"
      icon="server"
      onRetry={reset}
      title="Merci de réessayer plus tard"
      description="Nous n'arrivons pas à afficher votre espace pour le moment. Réessayez dans quelques instants."
      tone="red"
    />
  );
}
