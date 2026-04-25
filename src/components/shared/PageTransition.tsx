"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const [key, setKey] = useState(pathName);

  useEffect(() => {
    setKey(pathName);
  }, [pathName]);

  return (
    <div
      key={key}
      className={cn("animate-in fade-in slide-in-from-bottom-2 duration-500")}
    >
      {children}
    </div>
  );
}
