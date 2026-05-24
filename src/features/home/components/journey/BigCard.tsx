import { JourneyItem } from "../../data/journey";

export function BigJourneyCard({ item }: { item: JourneyItem }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/30 md:p-6">
      <p className="text-sm font-medium text-primary">{item.context}</p>

      <div className="mt-5 grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">Summary</h4>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.summary}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-tight">
            Engineering Growth
          </h4>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.growth}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold tracking-tight">Key Work</h4>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
          {item.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
