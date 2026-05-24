import { JourneyItem } from "../../data/journey";

export function SmallJourneyCard({ item }: { item: JourneyItem }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30 md:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        {item.label}
      </p>
      <p className="mt-3 text-sm font-medium text-muted-foreground">
        {item.period}
      </p>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">
        {item.stage}
      </h3>
      <p className="mt-1 text-sm text-foreground/80">{item.role}</p>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {item.stack.slice(0, 3).join(" · ")}
      </p>
    </div>
  );
}
