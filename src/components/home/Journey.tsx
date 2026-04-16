const journey = [
  {
    year: "2024",
    title: "Building full-stack systems",
    description:
      "Developing a real-world e-commerce platform with authentication, admin tools, and scalable backend architecture.",
  },
  {
    year: "2023",
    title: "Freelance & independent projects",
    description:
      "Built multiple applications including a bookkeeping system, audio streaming app, and business websites.",
  },
  {
    year: "2022",
    title: "Backend engineering at MPT",
    description:
      "Worked on Spring Boot systems, database optimization, and API integrations in a production environment.",
  },
  {
    year: "Before",
    title: "Discovering software engineering",
    description:
      "Started from curiosity about building systems and gradually developed a focus on backend engineering and architecture.",
  },
];

export function Journey() {
  return (
    <section className="mt-16 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Journey</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A short timeline of my experience and how I got here.
        </p>
      </div>
      <div className="relative my-12">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-border sm:left-1/2 sm:-translate-x-1/2" />

        <div className="space-y-12">
          {journey.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div key={item.year} className="relative flex items-center">
                {/* Left side (desktop only) */}
                <div className="hidden w-1/2 sm:block sm:pr-8 sm:text-right">
                  {isLeft && (
                    <div className="inline-block rounded-lg border border-border bg-card p-4">
                      <h3 className="font-semibold">{item.year}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Dot */}
                <div className="absolute left-2.75 sm:left-1/2 sm:-translate-x-1/2">
                  <span className="block h-3 w-3 rounded-full bg-primary" />
                </div>

                {/* Right side (mobile + desktop) */}
                <div className="w-full pl-10 sm:w-1/2 sm:pl-8">
                  {!isLeft && (
                    <div className="hidden sm:inline-block rounded-lg border border-border bg-card p-4">
                      <h3 className="font-semibold">{item.year}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* Mobile version (always show here) */}
                  <div className="sm:hidden">
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h3 className="font-semibold">{item.year}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
