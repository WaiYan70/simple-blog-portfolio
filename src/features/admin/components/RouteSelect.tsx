import { Button } from "@/components/ui/button";
import { Home, BookMarked, LayoutGrid, type LucideIcon } from "lucide-react";

export default function RouteSelect() {
  return (
    <div className="space-y-1">
      <Route Icon={Home} selected={true} title="Dashbaord" />
      <Route Icon={BookMarked} selected={false} title="Posts" />
      <Route Icon={LayoutGrid} selected={false} title="Projects" />
    </div>
  );
}

function Route({
  Icon,
  selected,
  title,
}: {
  Icon: LucideIcon;
  selected: boolean;
  title: string;
}) {
  return (
    <button
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow, bg-background,color] ${selected ? "bg-white text-stone-950 shadow" : "hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"}`}
    >
      <Icon size={15} />
      <span className="font-medium">{title}</span>
    </button>
  );
}
