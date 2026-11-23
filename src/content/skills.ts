/**
 * Skill levels are deliberately honest:
 *  - "core"      → used regularly in real product work
 *  - "working"   → used in projects, comfortable with
 *  - "exploring" → experimented with / learning
 */
export type SkillLevel = "core" | "working" | "exploring";

export type SkillGroup = {
  id: string;
  title: string;
  blurb: string;
  skills: { name: string; level: SkillLevel }[];
};

export const skillLevels: Record<SkillLevel, { label: string; description: string }> = {
  core: { label: "Core", description: "Used regularly in real product work" },
  working: { label: "Working", description: "Used in projects, comfortable" },
  exploring: { label: "Exploring", description: "Experimented with, still learning" },
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Interfaces that are fast, responsive and maintainable.",
    skills: [
      { name: "JavaScript", level: "core" },
      { name: "React", level: "core" },
      { name: "Next.js", level: "core" },
      { name: "HTML", level: "core" },
      { name: "CSS", level: "core" },
      { name: "Tailwind CSS", level: "core" },
      { name: "Material UI", level: "working" },
      { name: "TypeScript", level: "working" },
    ],
  },
  {
    id: "backend",
    title: "Backend & Data",
    blurb: "APIs, schemas and the data underneath the product.",
    skills: [
      { name: "Node.js", level: "core" },
      { name: "Express", level: "working" },
      { name: "PostgreSQL", level: "core" },
      { name: "Prisma ORM", level: "core" },
      { name: "Neon PostgreSQL", level: "working" },
      { name: "MongoDB", level: "working" },
      { name: "Firebase", level: "working" },
      { name: "Firestore", level: "working" },
    ],
  },
  {
    id: "ai",
    title: "AI & Intelligent Systems",
    blurb: "Using models where they help, and deterministic logic where it's needed.",
    skills: [
      { name: "AI integration", level: "working" },
      { name: "Evaluation engines", level: "working" },
      { name: "Python", level: "working" },
      { name: "Ollama", level: "exploring" },
      { name: "Phi-3", level: "exploring" },
      { name: "LLM experimentation", level: "exploring" },
    ],
  },
  {
    id: "infra",
    title: "Tools & Infrastructure",
    blurb: "Shipping, debugging and keeping things running.",
    skills: [
      { name: "Git", level: "core" },
      { name: "GitHub", level: "core" },
      { name: "Postman", level: "core" },
      { name: "Vercel", level: "working" },
      { name: "Render", level: "working" },
      { name: "Docker", level: "exploring" },
      { name: "Linux", level: "exploring" },
      { name: "Nginx", level: "exploring" },
      { name: "PM2", level: "exploring" },
    ],
  },
];
