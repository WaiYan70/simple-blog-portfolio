const principles = [
  {
    title: "Understand before building",
    description:
      "I focus on understanding the problem deeply before writing code, including constraints, tradeoffs, and real-world use cases.",
  },
  {
    title: "Design for scalability early",
    description:
      "I think about how systems will grow, including performance, maintainability, and architecture decisions from the start.",
  },
  {
    title: "Prefer clarity over cleverness",
    description:
      "I aim to write code and design systems that are easy to understand, debug, and extend.",
  },
  {
    title: "Learn through real systems",
    description:
      "I build real-world projects and reflect on decisions to improve both technical skills and engineering judgment.",
  },
];

export function HowIThink() {
  return (
    <section className="mt-16 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">How I Think</h2>

        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          My approach to building systems and solving real-world problems.
        </p>
      </div>

      <div className="space-y-6">
        {principles.map((item) => (
          <div key={item.title} className="max-w-3xl">
            <h3 className="font-semibold tracking-tight">{item.title}</h3>

            <p className="mt-1 text-sm text-muted-foreground leading-6">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
