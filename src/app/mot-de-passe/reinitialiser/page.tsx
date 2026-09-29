import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";

export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ email?: string; token?: string }> }) {
  const params = await searchParams;
  return (
    <AuthPageShell appearance="dark" eyebrow="Sécurité" title="Choisir un nouveau mot de passe" description="Utilisez un mot de passe unique contenant une majuscule, une minuscule, un chiffre et un symbole." alternativePrompt="Besoin d’un nouveau lien ?" alternativeLabel="Renvoyer l’email" alternativeHref="/forgot-password">
      <ResetPasswordForm email={params.email ?? ""} token={params.token ?? ""} />
    </AuthPageShell>
  );
}
