type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={`${className ?? ""}`}>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}

      {action && <div>{action}</div>}
    </div>
  );
}
