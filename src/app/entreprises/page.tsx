import type { Metadata } from "next";
import { CompaniesDirectory } from "@/components/marketplace/CompaniesDirectory";
import { getCompaniesStrict } from "@/services/api/matli";

export const metadata: Metadata = {
  title: "Entreprises de location de matériel BTP au Maroc",
  description: "Découvrez les entreprises vérifiées qui proposent des machines et engins BTP à la location partout au Maroc.",
  alternates: { canonical: "/companies" },
};

export const revalidate = 60;

export default async function CompaniesPage() {
  const companies = await getCompaniesStrict().catch(() => []);

  return <CompaniesDirectory initialCompanies={companies} />;
}
