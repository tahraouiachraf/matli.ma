import Link from "next/link";
import { JsonLd, breadcrumbJsonLd, type BreadcrumbItem } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Fil d’Ariane" className="text-sm font-semibold text-neutral-600">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, index) => (
            <li key={item.path} className="inline-flex min-w-0 items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {index === items.length - 1 ? (
                <span aria-current="page" className="break-words">{item.name}</span>
              ) : (
                <Link href={item.path} className="hover:text-orange-700 hover:underline">{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
