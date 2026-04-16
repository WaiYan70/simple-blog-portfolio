import { BaseCard } from "../shared/BaseCard";

export function CurrentBuild() {
  return (
    <section className="mt-16 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Currently Working On
        </h2>
        <p className="text-sm text-muted-foreground">
          What I am actively building and improving.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Currently Building */}
        <BaseCard>
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                In Progress
              </span>

              <h3 className="text-lg font-semibold tracking-tight transition group-hover:text-primary">
                Personal Portfolio & Blog Platform
              </h3>

              <p className="text-sm text-muted-foreground leading-6">
                Designing a blog-first portfolio using Next.js, MDX, and a
                structured content system focused on clarity and system
                thinking.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Next.js", "Bun.js", "TypeScript.js", "MDX"].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </BaseCard>

        {/* Maintaining */}
        <BaseCard>
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Maintaining
              </span>

              <h3 className="text-lg font-semibold tracking-tight transition group-hover:text-primary">
                Scalable E-commerce Platform
              </h3>

              <p className="text-sm text-muted-foreground leading-6">
                Refactoring authentication, Improving performance, and Enhancing
                admin workflows, and Focusing on clarity and scalability.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Express.js", "Node.js", "TypeScript", "Redis", "MongoDB"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </BaseCard>
      </div>
    </section>
  );
}
