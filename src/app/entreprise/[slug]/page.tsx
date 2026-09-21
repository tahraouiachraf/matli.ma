import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyProfile } from "@/components/marketplace/CompanyProfile";
import { ApiError } from "@/services/api/client";
import { getCompanyDetailStrict } from "@/services/api/matli";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getCompanyDetailStrict(slug).catch(() => null);
  const company = payload?.company;

  return company
    ? {
        title: `${company.name} - Location matériel à ${company.city}`,
        description: company.description,
        alternates: {
          canonical: `/entreprise/${company.slug}`,
        },
        openGraph: {
          title: `${company.name} - Machines BTP à louer à ${company.city}`,
          description: company.description,
          url: `/entreprise/${company.slug}`,
          type: "profile",
        },
      }
    : {
        title: "Entreprise de location de matériel BTP",
        description: "Consultez le parc matériel et les offres de cette entreprise sur MATLI.ma.",
        alternates: { canonical: `/entreprise/${slug}` },
      };
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const initialPayload = await getCompanyDetailStrict(slug).catch((error) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    return null;
  });

  return <CompanyProfile slug={slug} initialPayload={initialPayload} />;
}
