import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte MATLI pour déposer, réserver ou gérer vos machines.",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const notice = params?.verified === "1"
    ? "Votre adresse email est confirmée. Vous pouvez maintenant vous connecter."
    : params?.registered === "1"
      ? params?.email_sent === "0"
        ? "Compte créé. L’email de confirmation n’a pas encore pu être envoyé. Vous pourrez demander un nouvel envoi depuis cette page."
        : "Compte créé. Consultez votre boîte email et confirmez votre adresse avant de vous connecter."
      : undefined;
  return (
    <AuthPageShell appearance="dark" eyebrow="Connexion" title="Accéder à mon compte" description="Connectez-vous pour déposer une machine, comparer les offres ou suivre vos réservations." alternativePrompt="Nouveau sur MATLI ?" alternativeLabel="Créer un compte" alternativeHref="/inscription">
      <LoginForm notice={notice} />
    </AuthPageShell>
  );
}
