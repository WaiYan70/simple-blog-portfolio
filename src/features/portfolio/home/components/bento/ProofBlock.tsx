import { FolderKanban } from "lucide-react";
import { Block } from "./Block";

export function ProofBlock() {
  return (
    <Block className="col-span-12 md:col-span-6 bg-muted/40">
      <div className="flex items-center gap-2">
        <FolderKanban className="h-5 w-5 text-primary" />

        <p className="text-xs uppercase tracking-[0.2em] text-muted-foregroun">
          Project Proof
        </p>
      </div>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-4xl font-semibold tracking-tight text-primary">
          3
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          case studies
        </span>
      </p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Auth systems, admin workflows, and content-driven apps documented from
        implementation to tradeoffs.
      </p>
    </Block>
  );
}
