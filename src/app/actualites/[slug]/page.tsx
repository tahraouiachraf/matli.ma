import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { getNewsArticleStrict } from "@/services/api/matli";

type PageProps = { params: Promise<{ slug: string }> };
const fallbackImage = "/equipment/jcb-excavator-quarry.jpg";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("fr-MA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleStrict(slug).catch(() => null);
  if (!article) return { title: "Actualité introuvable" };

  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
  };
}

export const revalidate = 300;

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsArticleStrict(slug).catch(() => null);
  if (!article) notFound();

  const paragraphs = (article.content ?? "").split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl ? [article.imageUrl] : [absoluteUrl(fallbackImage)],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.authorName ?? "MATLI.ma" },
    publisher: { "@type": "Organization", name: "MATLI.ma", url: absoluteUrl() },
    mainEntityOfPage: absoluteUrl(`/news/${article.slug}`),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <article>
        <header className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
            <Link href="/news" className="inline-flex items-center gap-2 text-sm font-black text-orange-700"><ArrowLeft size={17} aria-hidden /> Toutes les actualités</Link>
            <h1 className="mt-6 text-4xl font-black leading-tight text-neutral-950 sm:text-5xl">{article.title}</h1>
            <p className="mt-5 text-lg leading-8 text-neutral-600">{article.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-neutral-500">
              <span className="inline-flex items-center gap-2"><CalendarDays size={17} aria-hidden /> {dateLabel(article.publishedAt)}</span>
              <span className="inline-flex items-center gap-2"><UserRound size={17} aria-hidden /> {article.authorName ?? "Équipe MATLI"}</span>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="aspect-[16/8] rounded-lg bg-neutral-100 bg-cover bg-center shadow-sm" role="img" aria-label={`Illustration de ${article.title}`} style={{ backgroundImage: `url(${article.imageUrl ?? fallbackImage})` }} />
          <div className="mx-auto mt-10 max-w-3xl space-y-6 text-base leading-8 text-neutral-700 sm:text-lg">
            {paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>)}
          </div>
        </div>
      </article>
    </main>
  );
}
