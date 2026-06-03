"use client";

import { Home, BookMarked, LayoutGrid, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminRoutes = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Posts", href: "/admin/posts", icon: BookMarked },
  { title: "Projects", href: "/admin/projects", icon: LayoutGrid },
];

export default function RouteSelect() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="space-y-1">
      {adminRoutes.map((route) => {
        const Icon = route.icon;
        const selected =
          route.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(route.href);
        return (
          <Link
            key={route.href}
            href={route.href}
            aria-current={selected ? "page" : undefined}
            className={`flex w-full items-center justify-start gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
              selected
                ? "bg-white text-stone-950 shadow"
                : "bg-transparent text-stone-500 hover:bg-stone-200"
            }`}
          >
            <Icon size={15} />
            <span>{route.title}</span>
          </Link>
        );
      })}
    </nav>
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
