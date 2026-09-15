import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { EmailVerificationForm } from "@/components/forms/EmailVerificationForm";

export const metadata: Metadata = {
  title: "Confirmation de l’adresse email",
  description: "Confirmez votre adresse email pour accéder à votre compte MATLI.",
  robots: { index: false, follow: false },
};

type VerificationPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function value(parameter: string | string[] | undefined): string | undefined {
  return typeof parameter === "string" ? parameter : undefined;
}

export default async function VerificationEmailPage({ searchParams }: VerificationPageProps) {
  const params = await searchParams;

  return (
    <AuthPageShell
      appearance="dark"
      eyebrow="Vérification email"
      title="Confirmer mon compte"
      description="Nous vérifions votre adresse afin de sécuriser votre compte et vos échanges sur MATLI."
      alternativePrompt="Vous avez déjà confirmé votre compte ?"
      alternativeLabel="Se connecter"
      alternativeHref="/connexion"
    >
      <EmailVerificationForm
        id={value(params?.id)}
        hash={value(params?.hash)}
        expires={value(params?.expires)}
        signature={value(params?.signature)}
      />
    </AuthPageShell>
  );
}
