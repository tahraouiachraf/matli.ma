import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";
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
      <OwnerWorkspace activeHref="/profile">
        <section className="min-w-0">
          <div className="mb-8">
            <p className="font-bold text-orange-600">Mon compte</p>
            <h1 className="mt-2 text-3xl font-black text-neutral-950 sm:text-4xl">Compléter mon profil</h1>
            <p className="mt-4 max-w-2xl text-neutral-600">
              Gardez vos coordonnées à jour pour gérer vos locations et faciliter les échanges sur MATLI.
            </p>
          </div>

          <ProfileForm />
        </section>
      </OwnerWorkspace>
    </AuthGuard>
  );
}
