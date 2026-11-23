import { projects } from "@/content/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "./work/ProjectCard";
import { WorkController } from "./work/WorkList";

export function Work() {
  return (
    <section id="work" data-scene="work" aria-labelledby="work-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeader
          id="work-title"
          index="03"
          label="Selected work"
          title={["Things I've built,", { em: "and how" }, "they work."]}
          intro="Five case studies: the problem, what I built, the hard parts, and the architecture underneath. No invented metrics, just the engineering."
        />
        <ol id="work-list" className="mt-16 flex flex-col gap-6 md:mt-24 md:gap-[12vh]">
          {projects.map((p, i) => (
            <li key={p.id} data-card className="md:sticky" style={{ top: `calc(var(--nav-h) + 0.5rem + ${i * 14}px)` }}>
              <ProjectCard project={p} total={projects.length} />
            </li>
          ))}
        </ol>
        <WorkController listId="work-list" />
      </div>
    </section>
  );
}
