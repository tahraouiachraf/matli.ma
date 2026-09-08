import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Créer un compte propriétaire ou client",
  description: "Créez un compte MATLI pour publier vos machines BTP, recevoir des demandes ou réserver du matériel au Maroc.",
  alternates: {
    canonical: "/inscription",
  },
};

export default function RegisterPage() {
  return (
    <AuthPageShell appearance="dark" eyebrow="Inscription" title="Créer mon compte" description="Choisissez votre profil, confirmez votre email et commencez à louer ou publier du matériel." alternativePrompt="Déjà inscrit ?" alternativeLabel="Se connecter" alternativeHref="/connexion">
      <RegisterForm />
    </AuthPageShell>
  );
}
