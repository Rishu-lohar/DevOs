export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  "data-testid": testId,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
}) {
  return (
    <div data-testid={testId || "page-header"} className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#86EFAC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-[#71717A]">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
