/**
 * ─────────────────────────────────────────────────────────────
 *  PROFILE CONFIG — the single source of truth for who you are.
 *  Edit values here; no UI component needs to change.
 *
 *  Anything set to `null` is intentionally unfilled. The UI hides or
 *  degrades gracefully for null values instead of showing fake data.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Abhishek Kumar",
  firstName: "Abhishek",
  lastName: "Kumar",
  initials: "AK",

  /** Rotating role line under the name in the hero. */
  roles: ["Software Engineer", "Full-Stack Developer", "Tech Lead", "AI Product Builder"],

  headline: "Building products that solve real problems.",
  tagline: "Building products. Engineering experiences. Exploring what's next.",
  intro:
    "I'm a software developer and product builder focused on full-stack engineering, AI-powered systems, and turning ambitious ideas into real-world products, from architecture to production.",

  /** Short status line shown in the hero + footer. */
  currently: "Building Eduvantix at DatamindsX",

  location: "Bengaluru, India",
  timezone: "Asia/Kolkata",

  email: "ak5931431@gmail.com",

  githubUsername: "03abhishek-kumar",

  socials: {
    github: "https://github.com/03abhishek-kumar",
    linkedin: "https://www.linkedin.com/in/03abhishek-kumar/",
  },

  /**
   * PLACEHOLDER — drop your PDF into /public (e.g. /public/Abhishek-Kumar-Resume.pdf)
   * and set this to "/Abhishek-Kumar-Resume.pdf".
   * While null, the "Resume" CTA becomes a "Request resume" email link instead of a dead link.
   */
  resumeUrl: null as string | null,

  /**
   * PLACEHOLDER — set your production URL (or NEXT_PUBLIC_SITE_URL) once deployed.
   * Used for metadata / Open Graph only.
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  education: {
    institution: "Polaris School of Technology",
    location: "Bengaluru, India",
    degree: "B.Tech, Computer Science & Engineering (AI/ML)",
    period: "2025 — 2029 (expected)",
    note: "First-year student taking ownership of real product engineering alongside coursework.",
  },
} as const;

export type Profile = typeof profile;

/** Section anchors used by the nav. Order = nav order. */
export const navLinks = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;
