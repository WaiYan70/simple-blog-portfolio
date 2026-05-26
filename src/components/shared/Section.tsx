import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className, id }: SectionProps) {
  return (
    <section className={cn("my-12 space-y-6", className)} id={id}>
      {children}
    </section>
  );
}
