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

// export function Journey() {
//   return (
//     <section className="mt-16 space-y-6">
//       <div className="space-y-2">
//         <h2 className="text-2xl font-semibold tracking-tight">Journey</h2>
//         <p className="max-w-2xl text-sm text-muted-foreground">
//           A short timeline of my experience and how I got here.
//         </p>
//       </div>

//       <div className="relative">
//         <div className="absolute left-4 top-0 h-full w-px bg-border" />

//         {journey.map((item) => (
//           <div key={item.title} className="relative mb-8 pl-12">
//             <span className="absolute left-2.75 top-2 h-3 w-3 rounded-full bg-primary" />

//             <div className="rounded-lg border bg-card p-5">
//               <h3 className="font-semibold">{item.title}</h3>
//               <p className="text-sm text-muted-foreground">
//                 {item.description}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

export function Journey() {
  return (
    <section className="relative mx-auto max-w-5xl py-12">
      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-border" />

      <div className="space-y-12">
        {journey.map((item, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div key={item.year} className="relative flex items-center">
              {/* Left side */}
              <div className={`w-1/2 ${isLeft ? "pr-8 text-right" : ""}`}>
                {isLeft && (
                  <div className="inline-block rounded-lg border border-border bg-card p-4">
                    <h3 className="font-semibold">{item.year}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Center dot */}
              <div className="absolute left-1/2 -translate-x-1/2">
                <span className="block h-3 w-3 rounded-full bg-primary" />
              </div>

              {/* Right side */}
              <div className={`w-1/2 ${!isLeft ? "pl-8" : ""}`}>
                {!isLeft && (
                  <div className="inline-block rounded-lg border border-border bg-card p-4">
                    <h3 className="font-semibold">{item.year}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
