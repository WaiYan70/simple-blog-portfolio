import { JourneyItem } from "../../data/journey";

export function MobileJourneyCard({ item }: { item: JourneyItem }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/30">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {item.label}
        </p>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          {item.period}
        </p>
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-semibold tracking-tight">{item.stage}</h3>
        <p className="mt-1 text-sm text-foreground/80">{item.role}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <p className="text-sm font-medium text-primary">{item.context}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {item.summary}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {item.growth}
        </p>
        <div className="mt-5">
          <h4 className="text-sm font-semibold tracking-tight">Key Works</h4>
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
    </div>
  );
}
