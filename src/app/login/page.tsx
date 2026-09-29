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
  const registeredEmail = params?.registered === "1" && typeof params.email === "string" ? params.email : undefined;
  const notice = params?.verified === "1"
    ? "Votre adresse email est confirmée. Vous pouvez maintenant vous connecter."
    : params?.registered === "1"
      ? params?.email_sent === "0"
        ? "Compte créé. L’email de confirmation n’a pas encore pu être envoyé. Vous pourrez demander un nouvel envoi depuis cette page."
        : "Compte créé. Vérifiez votre boîte email et vos courriers indésirables, puis confirmez votre adresse. Vous pouvez renvoyer le message ci-dessous."
      : params?.password_reset === "1"
        ? "Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter."
        : undefined;

  return (
    <AuthPageShell appearance="dark" eyebrow="Connexion" title="Accéder à mon compte" description="Connectez-vous pour déposer une machine, comparer les offres ou suivre vos réservations." alternativePrompt="Nouveau sur MATLI ?" alternativeLabel="Créer un compte" alternativeHref="/register">
      <LoginForm notice={notice} initialVerificationEmail={registeredEmail} />
    </AuthPageShell>
  );
}
