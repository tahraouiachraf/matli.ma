type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold text-neutral-950 md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-neutral-600 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
