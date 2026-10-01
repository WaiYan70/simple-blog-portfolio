export type JourneyItem = {
  period: string;
  label: string;
  stage: string;
  role: string;
  context: string;
  stack: string[];
  summary: string;
  growth: string;
  highlights: string[];
};

export const journey: JourneyItem[] = [
  {
    period: "July 2025 - Present",
    label: "Current Focus",
    stage: "Production Systems",
    role: "Freelance Software Engineer",
    context: "E-commerce platform with admin dashboard",
    stack: ["MERN", "TypeScript", "Redis", "Cloudinary", "Stripe"],
    summary:
      "Building a production-focused commerce system with customer flows, admin operations, payment review, automation, and deployment ownership.",
    growth:
      "This project helped me connect backend architecture, authentication, admin workflows, deployment, and security into one real-world system.",
    highlights: [
      "Built commerce workflows for inventory, order administration, delivery fee calculation, and product classification.",
      "Implemented QR-based manual payment verification with proof uploads, admin review, resubmission requests, refunds, and cancellations.",
      "Delivered secure auth with HttpOnly JWT cookies, refresh token rotation, Google OAuth, RBAC, Brevo email verification, and password reset flows.",
      "Added SSE exchange-rate updates, product scraping for 100+ items from 3 brands, Cloudinary media storage, backend protections, and VPS deployment.",
    ],
  },
  {
    period: "August 2024 - Present",
    label: "Client Operations",
    stage: "Internal Tools",
    role: "Freelance Software Engineer",
    context: "Fleet management and expense tracking system",
    stack: ["MERN", "TypeScript", "JWT", "Charts"],
    summary:
      "Developing an internal operations system for a taxi service business managing around 20 vehicles.",
    growth:
      "This work strengthened how I model real business workflows, protect owner-only modules, and turn operational data into useful dashboards.",
    highlights: [
      "Centralized driver records, vehicle tracking, expense management, license expiration notifications, and repair scheduling.",
      "Implemented authentication and role-based authorization for owner-only financial and operations modules.",
      "Built responsive dashboards and reports to improve financial visibility and daily fleet management workflows.",
    ],
  },
  {
    period: "April 2023 - August 2023",
    label: "Freelance Start",
    stage: "Business Websites",
    role: "Freelance Web Developer",
    context: "Websites for local computer shops",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    summary:
      "Designed, developed, and deployed responsive business websites for two local computer shops in Myanmar.",
    growth:
      "These projects helped me practice translating business needs into clear frontend structure, readable content, and practical deployment decisions.",
    highlights: [
      "Translated business requirements into clear frontend experiences for local customers.",
      "Improved online visibility and accessibility with responsive layouts and practical content structure.",
    ],
  },
  {
    period: "September 2022 - February 2023",
    label: "First Engineering Role",
    stage: "Backend Systems",
    role: "Junior Software Engineer",
    context: "MPT (Myanmar Posts and Telecommunications)",
    stack: ["Spring Boot", "Oracle SQL", "REST APIs"],
    summary:
      "Worked on internal financial tracking features and backend integrations in a production engineering environment.",
    growth:
      "This role gave me early exposure to production code, backend debugging, database performance, and cross-team delivery habits.",
    highlights: [
      "Developed Spring Boot API features that helped streamline financial data workflows and reduce manual reporting time by 30%.",
      "Optimized Oracle SQL queries, improving data retrieval performance by 25% and supporting more accurate financial reporting.",
      "Collaborated on backend testing, debugging, API integration, and issue resolution to improve application stability.",
    ],
  },
  {
    period: "Before",
    label: "Foundation",
    stage: "Learning Core Skills",
    role: "Software Engineering Student",
    context: "University and self-study",
    stack: ["HTML", "CSS", "JavaScript", "Java", "Python", "C#"],
    summary:
      "Built the fundamentals across frontend, backend, programming languages, and problem solving before moving into production projects.",
    growth:
      "This period shaped my interest in full-stack engineering and gave me the base to understand both UI implementation and backend logic.",
    highlights: [
      "Learned core web development through HTML, CSS, and JavaScript.",
      "Practiced backend and object-oriented programming with Java, C#, and Python.",
      "Built early projects that helped me move from syntax practice toward real application structure.",
    ],
  },
];
