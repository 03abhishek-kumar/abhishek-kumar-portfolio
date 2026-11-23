/**
 * Milestones: verified recognition + ownership milestones.
 * `kind: "recognition"` items come from the resume; everything else
 * is a project/leadership milestone, not a formal award.
 */
export type Milestone = {
  title: string;
  detail: string;
  kind: "recognition" | "ownership" | "engineering" | "practice";
  /** Optional period label, left blank where no verified date exists. */
  when?: string;
};

export const milestones: Milestone[] = [
  {
    title: "2nd Prize, Smart India Hackathon (SIH) Mockathon 2026",
    detail: "Built and pitched a social-impact software solution under time pressure, placing 2nd against college-level teams.",
    kind: "recognition",
    when: "2026",
  },
  {
    title: "Technical ownership of Eduvantix",
    detail: "Took on feature architecture, full-stack implementation and delivery coordination for a production learning platform.",
    kind: "ownership",
  },
  {
    title: "Led the AI Viva System",
    detail: "Designed the viva engine, question banks, keyword evaluation and data model, and ran the local-LLM experiments.",
    kind: "ownership",
  },
  {
    title: "AI & backend infrastructure",
    detail: "Hands-on with Prisma + Neon PostgreSQL, locally hosted models via Ollama, and deployment and backend-infrastructure experiments.",
    kind: "engineering",
  },
  {
    title: "Hackathon-oriented engineering",
    detail: "Smart India Hackathon problem-statement research and pitch preparation; contributor to the Bouncer access-review agent.",
    kind: "engineering",
  },
  {
    title: "Shipped full-stack products",
    detail: "BhojanGo is live on Vercel, and the Health Metrics Calculator is live on GitHub Pages.",
    kind: "engineering",
  },
  {
    title: "100+ DSA problems solved",
    detail: "Consistent practice on LeetCode and CodeChef to sharpen algorithmic problem-solving.",
    kind: "practice",
  },
];
