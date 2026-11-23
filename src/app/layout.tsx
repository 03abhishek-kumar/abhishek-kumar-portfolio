import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const title = `${profile.name} | Software Engineer & Product Builder`;
const description = `${profile.name}: software developer, full-stack engineer and AI product builder. ${profile.intro}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s | ${profile.name}` },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: profile.socials.github }],
  creator: profile.name,
  keywords: [
    profile.name,
    "Software Engineer",
    "Full-Stack Developer",
    "Tech Lead",
    "AI Product Builder",
    "Next.js",
    "React",
    "PostgreSQL",
    "Bengaluru",
  ],
  openGraph: {
    type: "website",
    title,
    description,
    siteName: profile.name,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060608",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint:
 *  - `js` enables enter/reveal states (content stays visible without JS)
 *  - the intro curtain plays once per session; reduced-motion users skip it
 */
const bootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var s=sessionStorage.getItem('ak-intro');if(r||s){d.classList.add('no-intro','is-ready');}}catch(e){document.documentElement.classList.add('no-intro','is-ready');}})();`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Software Developer",
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.institution },
  sameAs: [profile.socials.github, profile.socials.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
