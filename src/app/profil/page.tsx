import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ProfileForm } from "@/components/forms/ProfileForm";

export const metadata: Metadata = {
  title: "Profil",
  description: "Complétez votre profil MATLI pour déposer et louer du matériel professionnel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <AuthGuard title="Connectez-vous pour modifier votre profil">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="font-bold text-orange-600">Profil propriétaire</p>
        <h1 className="mt-2 text-4xl font-black">Compléter mon profil</h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Ces informations serviront à afficher votre entreprise et à recevoir les demandes de location.
        </p>
      </div>

      <ProfileForm />
      </section>
    </AuthGuard>
  );
}
