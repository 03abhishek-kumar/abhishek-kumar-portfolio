export type ProcessStep = {
  no: string;
  title: string;
  body: string;
  points: string[];
};

export const process: ProcessStep[] = [
  {
    no: "01",
    title: "Understand the problem.",
    body: "Before any code: who is this for, what hurts today, and what would “done” actually look like?",
    points: ["User & stakeholder needs", "Constraints and edge cases", "Definition of done"],
  },
  {
    no: "02",
    title: "Design the architecture.",
    body: "Data models, boundaries and flows get decided on paper first, because they're the expensive things to change later.",
    points: ["Schema & data flow", "Service boundaries", "Where AI helps (and where it doesn't)"],
  },
  {
    no: "03",
    title: "Build with ownership.",
    body: "Own the feature end-to-end: frontend, API, data and the unglamorous parts in between.",
    points: ["Reusable components", "Clean, reviewed code", "Full-stack delivery"],
  },
  {
    no: "04",
    title: "Test and refine.",
    body: "Break it on purpose. Debug to the root cause rather than patching the symptom.",
    points: ["Root-cause debugging", "Edge-case testing", "Performance as a feature"],
  },
  {
    no: "05",
    title: "Deploy and improve.",
    body: "Shipping is the start of the feedback loop, not the end of the work.",
    points: ["Production deploys", "Monitoring live issues", "Iterate on real usage"],
  },
];
