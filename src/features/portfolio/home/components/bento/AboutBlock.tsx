import { Block } from "./Block";

export function AboutBlock() {
  return (
    <Block className="col-span-12">
      <p className="text-lg sm:text-xl md:text-2xl leading-8 sm:leading-9 text-muted-foreground">
        I build{" "}
        <span className="font-medium text-foreground">full-stack systems</span>{" "}
        with{" "}
        <span className="font-medium text-foreground">a backend focus</span>,
        and document the{" "}
        <span className="font-medium text-foreground">
          architecture decisions,
        </span>{" "}
        <span className="font-medium text-foreground">tradeoffs</span>, and{" "}
        <span className="font-medium text-foreground">
          implementation details
        </span>{" "}
        behind them.
      </p>
    </Block>
  );
}
