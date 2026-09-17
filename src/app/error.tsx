"use client";

import { ErrorState } from "@/components/errors/ErrorState";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      code="500"
      eyebrow="Erreur applicative"
      title="Merci de réessayer plus tard"
      description="MATLI n’a pas pu charger cette page correctement. Réessayez dans quelques instants."
      digest={error.digest}
      reportedError={error}
      icon="server"
      tone="red"
      onRetry={reset}
    />
  );
}
