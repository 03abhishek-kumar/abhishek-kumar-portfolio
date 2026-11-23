/**
 * Projects are presented as case studies.
 * Every claim below is taken from the repository source/README, the resume,
 * or the brief. No metrics, user counts or demo links are invented.
 */

export type ProjectVisual = "eduvantix" | "viva" | "bouncer" | "bhojango" | "health";
export type ProjectDiagram = "viva" | "bouncer";

export type Project = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  categories: string[];
  year: string;
  role: string;
  /** Accent hue used by the card visual and case study. */
  accent: string;
  visual: ProjectVisual;
  flagship?: boolean;
  problem: string;
  summary: string;
  built: string[];
  challenges: { title: string; body: string }[];
  highlights: { label: string; value: string }[];
  diagram?: ProjectDiagram;
  stack: string[];
  links: { github?: string; live?: string };
  /** Shown when there are no public links, or to add honest context. */
  note?: string;
};

export const projects: Project[] = [
  {
    id: "eduvantix",
    index: "01",
    title: "Eduvantix",
    tagline: "One platform for learning, practice, assessment and careers.",
    categories: ["EdTech", "Full-Stack", "AI", "SaaS"],
    year: "2026 — ongoing",
    role: "Tech Lead / Software Developer",
    accent: "#7c8cff",
    visual: "eduvantix",
    flagship: true,
    problem:
      "Students move between separate tools for courses, coding practice, interview preparation and career material, while institutes run yet another set for attendance, mentors and classes. None of that data connects, so neither students nor mentors see the full picture of progress.",
    summary:
      "An integrated education and career-development platform that brings learning, coding practice, assessments, institute management and AI-powered career tools together in one product.",
    built: [
      "Course and learning management, with student and mentor dashboards.",
      "A coding platform with evaluation of submitted solutions.",
      "Institute management: mentors, attendance and academic records.",
      "Live sessions and recordings integrated into the learning flow.",
      "AI-powered viva assessment and interview workflows (see the AI Viva System case study).",
      "A resume builder and career-intelligence features, with premium, personalised learning paths.",
      "Reusable, responsive frontend components shared across modules.",
    ],
    challenges: [
      {
        title: "One model, many roles",
        body: "Students, mentors and institutes see the same data through different permissions. Designing the schema and access rules up front avoided rebuilding modules as roles were added.",
      },
      {
        title: "A wide surface, kept consistent",
        body: "Nine major product areas share patterns: dashboards, forms, tables, session flows. Shared components and conventions keep it feeling like one product rather than nine.",
      },
      {
        title: "Shipping into production",
        body: "Working on a live product means production deployment cycles, debugging real issues and treating performance as part of the feature, not a later pass.",
      },
    ],
    highlights: [
      { label: "Scope", value: "9 product areas" },
      { label: "Ownership", value: "Feature architecture → delivery" },
      { label: "Data", value: "PostgreSQL + Prisma" },
    ],
    stack: ["Next.js", "React", "JavaScript", "Material UI", "Node.js", "PostgreSQL", "Prisma"],
    links: {},
    note: "Proprietary product codebase, so no public repository. Happy to walk through the architecture in conversation.",
  },
  {
    id: "ai-viva",
    index: "02",
    title: "AI Viva System",
    tagline: "Oral examinations that scale, with scores you can explain.",
    categories: ["Artificial Intelligence", "Backend Engineering", "Assessment"],
    year: "2026",
    role: "Led development",
    accent: "#a78bfa",
    visual: "viva",
    problem:
      "A viva needs an examiner's time for every student, and scoring varies between examiners. Students rarely get structured feedback on which concepts they actually missed.",
    summary:
      "An AI-assisted viva assessment system: students answer questions by voice or text, answers are evaluated against expected concepts, and each session ends with a score and feedback.",
    built: [
      "A dedicated viva engine that runs sessions, serves questions and persists every answer.",
      "Question management with question banks across JavaScript, Python, DBMS and Computer Networks.",
      "A keyword-based evaluation engine that scores answers against expected keywords for each question.",
      "Scoring and feedback that show which expected concepts were covered and which were missed.",
      "Speech recognition for spoken answers, with a text-input fallback designed in.",
      "Database architecture with Prisma on Neon (serverless PostgreSQL).",
      "Experiments running local models through Ollama (Phi-3), plus deployment and backend infrastructure trials.",
    ],
    challenges: [
      {
        title: "Deterministic where it matters",
        body: "Scoring runs on a local keyword engine, not an LLM. The same answer always gets the same score, and the feedback can point to exactly which concepts were missing.",
      },
      {
        title: "Noisy speech input",
        body: "Speech-to-text can drop or mangle technical terms. The evaluator has to work with imperfect transcripts, and a text-input fallback has to always be available.",
      },
      {
        title: "Local models, real trade-offs",
        body: "Running Phi-3 locally through Ollama was explored as an experimental layer. It helped compare latency, hardware and cost against hosted options before committing to anything.",
      },
    ],
    highlights: [
      { label: "Evaluation", value: "Local keyword engine" },
      { label: "LLM layer", value: "Experimental (Ollama · Phi-3)" },
      { label: "Data", value: "Prisma · Neon PostgreSQL" },
    ],
    diagram: "viva",
    stack: ["Node.js", "Prisma", "Neon PostgreSQL", "Speech recognition", "Ollama", "Phi-3"],
    links: {},
    note: "Built inside the Eduvantix product, so no public repository.",
  },
  {
    id: "bouncer",
    index: "03",
    title: "Bouncer",
    tagline: "The access reviewer agent whose most important skill is not revoking.",
    categories: ["Security", "Backend Engineering", "Hackathon"],
    year: "2026",
    role: "Team contributor",
    accent: "#5eead4",
    visual: "bouncer",
    problem:
      "Database access piles up: people leave, roles linger, service accounts lose owners. But a naive “unused for 90 days → revoke” script can break a critical job, like a quarterly payments run that only touches its access four times a year.",
    summary:
      "An agent that reviews PostgreSQL access, separates flagging suspicious access from deciding what to do about it, prepares a least-privilege cleanup plan, and stops for human approval before anything destructive runs.",
    built: [
      "Six flagging rules (left the company, unowned superuser, unowned role, orphaned service account, stale, never used). A flag means “look closer”, never “revoke”.",
      "Context-aware decisions (KEEP / REVOKE / HOLD) using the HR roster, usage history, ownership, service dependencies and blast radius.",
      "Generated revoke and rollback SQL plans, linted and simulated in a sandbox before execution.",
      "Separate read-only and revoker tool paths, with approval checkpoints in front of every destructive action.",
      "My exploration focused on PostgreSQL roles and permissions, the Docker Compose environment, access-usage and HR-roster data, and service dependencies.",
    ],
    challenges: [
      {
        title: "Flagging ≠ revoking",
        body: "The key case: a service account unused for 91 days looks stale, but a critical quarterly reconciliation job depends on it. Bouncer puts it on HOLD instead of breaking production.",
      },
      {
        title: "Least privilege, not all-or-nothing",
        body: "An active employee with a DELETE grant they never used keeps their other access and loses only DELETE.",
      },
      {
        title: "Safety by design",
        body: "The sandbox has no network path to the database, so the dry run was redesigned as a local simulation instead of working around the restriction.",
      },
    ],
    highlights: [
      { label: "Decisions", value: "KEEP · REVOKE · HOLD" },
      { label: "Safety", value: "Human approval gates" },
      { label: "Env", value: "PostgreSQL · Docker Compose" },
    ],
    diagram: "bouncer",
    stack: ["PostgreSQL", "Docker Compose", "Python", "MCP", "Shell"],
    links: { github: "https://github.com/arenforge/bouncer-the-access-reviewer-agent" },
    note: "Team project. I'm one of several contributors to the repository.",
  },
  {
    id: "bhojango",
    index: "04",
    title: "BhojanGo",
    tagline: "A full-stack food-ordering product, from menu to doorstep.",
    categories: ["Product Development", "Full-Stack"],
    year: "2026",
    role: "Primary developer",
    accent: "#fb923c",
    visual: "bhojango",
    problem:
      "Ordering food involves several connected experiences (discovery, menus, cart, checkout, tracking and account management), each with its own state. The challenge was building them as one coherent product, not a set of disconnected pages.",
    summary:
      "A full-stack food-ordering web application with restaurant discovery, menus, cart and checkout, order tracking and role-aware user accounts.",
    built: [
      "Restaurant discovery, categories and restaurant detail pages with menu navigation.",
      "Cart logic, checkout and order placement, with order history and an order-journey view.",
      "Email/password authentication via Firebase Auth, user profiles with roles stored in Firestore, and protected routes.",
      "App-wide state with React Context (auth, restaurants, theme), including a dark mode.",
      "A REST API in Express + Mongoose with order, restaurant and user models, routes, controllers and a seed script.",
      "Product concepts for peak-hour insights, voice delivery notes and live tracking, currently prototyped with sample data.",
    ],
    challenges: [
      {
        title: "State across many screens",
        body: "Cart, auth and restaurant data flow through discovery, checkout, tracking and profile. Context providers keep that state in one place instead of passing it through every page.",
      },
      {
        title: "Two backends, clear boundaries",
        body: "Firebase handles identity and user profiles; the Express/MongoDB API owns orders and restaurants. Keeping that split clear kept each side simple.",
      },
    ],
    highlights: [
      { label: "Frontend", value: "React · Vite · Tailwind" },
      { label: "API", value: "Express · Mongoose" },
      { label: "Status", value: "Live on Vercel" },
    ],
    stack: ["React", "Vite", "Tailwind CSS", "React Router", "Firebase Auth", "Firestore", "Node.js", "Express", "MongoDB"],
    links: {
      github: "https://github.com/03abhishek-kumar/BhojanGo",
      live: "https://bhojan-go-blue.vercel.app",
    },
  },
  {
    id: "health-metrics",
    index: "05",
    title: "Health Metrics Calculator",
    tagline: "Health indicators, presented as risk bands people can read.",
    categories: ["HealthTech", "Web Development"],
    year: "2025",
    role: "Co-developer",
    accent: "#4ade80",
    visual: "health",
    problem:
      "Raw numbers like a BMI of 27.4 or a BMR of 1,640 kcal mean little to most people. The goal was to turn them into something immediately understandable.",
    summary:
      "A lightweight, client-side calculator for BMI and BMR that maps results onto colour-coded risk bands with short guidance, built with zero framework dependencies.",
    built: [
      "BMI calculation mapped to standard bands (< 18.5, 18.5–24.9, 25–29.9, ≥ 30) with colour-coded feedback.",
      "BMR using the Mifflin–St Jeor equation, with sex-specific constants and a reference range.",
      "History of the last five calculations persisted in localStorage, plus a combined health summary.",
      "Chart.js visualisations, a progress indicator and personalised tips based on the results.",
      "Input validation and dynamic result rendering in vanilla JavaScript.",
    ],
    challenges: [
      {
        title: "Clarity over precision theatre",
        body: "Bands and plain-language guidance do more for a user than a number to two decimal places.",
      },
      {
        title: "Fundamentals without a framework",
        body: "DOM updates, validation and state persistence written by hand in plain JavaScript.",
      },
    ],
    highlights: [
      { label: "Formulas", value: "BMI · Mifflin–St Jeor BMR" },
      { label: "Runtime", value: "Vanilla JS, zero deps" },
      { label: "Hosting", value: "GitHub Pages" },
    ],
    stack: ["HTML", "CSS", "JavaScript", "Chart.js", "localStorage"],
    links: {
      github: "https://github.com/03abhishek-kumar/Health-Metrics-Calculator-with-Risk-Bands",
      live: "https://03abhishek-kumar.github.io/Health-Metrics-Calculator-with-Risk-Bands/",
    },
    note: "Built together with Aditya Kumar. An educational tool using standard published formulas; not medical advice and not clinically validated.",
  },
];
