# Abhishek Kumar — Portfolio

Personal portfolio showcasing my software engineering journey, full-stack projects, AI-powered applications and technical leadership.

Built with **Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Three.js / React Three Fiber · GSAP ScrollTrigger · Lenis**.

## Run locally

Requires Node.js 20+ (developed on Node 24).

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start        # serves the production build on http://localhost:3000
npm run typecheck    # TypeScript only
```

## Editing content (no UI changes needed)

All content lives in `src/content/`:

| File | What it controls |
|---|---|
| `profile.ts` | Name, roles, headline, email, socials, education, **resume link**, site URL |
| `about.ts` | About statement, paragraphs, focus areas |
| `experience.ts` | Experience timeline (role, org, period, responsibilities, product areas) |
| `projects.ts` | Case studies (problem, what I built, challenges, stack, links) |
| `skills.ts` | Skill groups and honest levels (core / working / exploring) |
| `milestones.ts` | Recognition and milestones |
| `process.ts` | "Beyond writing code." steps |

### Placeholders to fill

- **Resume**: put your PDF in `public/` (e.g. `public/Abhishek-Kumar-Resume.pdf`) and set `resumeUrl: "/Abhishek-Kumar-Resume.pdf"` in `profile.ts`. Until then the button says "Request resume" and opens an email.
- **Site URL**: set `NEXT_PUBLIC_SITE_URL` (or `siteUrl` in `profile.ts`) after deploying; it's used for metadata, Open Graph, sitemap and robots.
- **Experience period**: `experience.ts` shows "Ongoing". Set an exact range if you want one.

## GitHub section

Fetched server-side from the public GitHub API and the public contribution calendar, revalidated hourly. Optional: set `GITHUB_TOKEN` (no scopes needed) for higher rate limits and the official GraphQL calendar.

## How the 3D works

- A single fixed WebGL layer renders a liquid-chrome "core" (custom vertex displacement injected into a PBR material) that moves between poses as you scroll (`src/lib/scene-director.ts`).
- First paint shows a lightweight CSS poster of the core. The WebGL chunk loads on first interaction (or after ~5.5 s idle) and crossfades in, so 3D never competes with the initial load.
- Phones get a matcap-shaded version (no environment map); software WebGL (SwiftShader etc.) keeps the CSS poster. Add `?webgl=force` to the URL to preview the 3D anyway.
- `prefers-reduced-motion` disables smooth scrolling, intro and motion; all content stays visible without JavaScript.

## Deploy

Works out of the box on Vercel (`next build`). Set `NEXT_PUBLIC_SITE_URL` and optionally `GITHUB_TOKEN` as environment variables.
