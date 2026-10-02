type RequiredFieldsLegendProps = {
  className?: string;
};

export function RequiredMark() {
  return (
    <>
      <span className="text-red-600" aria-hidden="true">*</span>
      <span className="sr-only"> (obligatoire)</span>
    </>
  );
}

export function RequiredFieldsLegend({ className = "" }: RequiredFieldsLegendProps) {
  return (
    <p className={`text-xs font-medium text-neutral-500 ${className}`.trim()}>
      <span className="font-black text-red-600" aria-hidden="true">*</span> Champs obligatoires
    </p>
  );
}
