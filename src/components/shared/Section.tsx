type SectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function Section({ children, className }: SectionProps) {
  return (
    <section className={`my-12 space-y-6 ${className ?? ""}`}>
      {children}
    </section>
  );
}
