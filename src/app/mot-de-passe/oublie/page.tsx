import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export const metadata: Metadata = { title: "Mot de passe oublié", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell appearance="dark" eyebrow="Sécurité" title="Réinitialiser mon mot de passe" description="Indiquez votre adresse email pour recevoir un lien sécurisé et temporaire." alternativePrompt="Vous connaissez votre mot de passe ?" alternativeLabel="Se connecter" alternativeHref="/connexion">
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
