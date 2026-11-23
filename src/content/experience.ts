export type ExperienceItem = {
  role: string;
  organization: string;
  orgNote?: string;
  /**
   * Shown as-is. Leave as "Ongoing" or set an exact range (e.g. "Jun 2026 — Present").
   * Not filled with a specific start date on purpose; set it yourself.
   */
  period: string;
  location?: string;
  summary: string;
  responsibilities: string[];
  areas: string[];
  stack: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Tech Lead / Software Developer",
    organization: "DatamindsX (DMX Academy)",
    orgNote: "Product subsequently rebranded as Eduvantix",
    period: "Ongoing",
    summary:
      "Building Eduvantix, an integrated learning-management and career-development platform that brings together ideas from LMS platforms, coding-practice products, interview preparation tools and institute management systems.",
    responsibilities: [
      "Technical ownership of product features, from requirement understanding through implementation, testing and delivery.",
      "Full-stack implementation across frontend modules, APIs and data models.",
      "Feature architecture: planning how modules, data and permissions fit together before building them.",
      "Debugging and resolving issues across frontend and backend, with root-cause analysis.",
      "Coordinating with product, design and QA in sprint planning, code reviews and delivery.",
    ],
    areas: [
      "Learning management & courses",
      "Coding practice & evaluation",
      "AI-powered viva & interviews",
      "Institute & mentor management",
      "Student dashboards",
      "Live classes & recordings",
      "Attendance & academics",
      "Resume builder & career tools",
      "Premium & personalised learning",
    ],
    stack: ["Next.js", "React", "JavaScript", "Material UI", "Node.js", "PostgreSQL", "Prisma"],
  },
];
