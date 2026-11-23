import { profile } from "@/content/profile";
import { getGitHubData } from "@/lib/github";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SceneLayer } from "@/components/three/SceneLayer";
import { Intro } from "@/components/layout/Intro";
import { Nav } from "@/components/layout/Nav";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { Skills } from "@/components/sections/Skills";
import { Milestones } from "@/components/sections/Milestones";
import { GitHub } from "@/components/sections/GitHub";
import { Contact } from "@/components/sections/Contact";

// Re-generate hourly so GitHub activity stays fresh without client-side API calls.
export const revalidate = 3600;

export default async function Home() {
  const github = await getGitHubData(profile.githubUsername);

  return (
    <>
      <MotionProvider />
      <SceneLayer />
      <Intro />
      <Nav />
      <Cursor />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Work />
        <Process />
        <Skills />
        <Milestones />
        <GitHub data={github} />
        <Contact />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </>
  );
}
