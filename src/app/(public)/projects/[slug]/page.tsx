import { notFound } from "next/navigation";
import Image from "next/image";
import { GitFork, ExternalLink } from "lucide-react";
import { Section, Chip, Breadcrumbs } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem, Mirror } from "@/components/ui/motion";
import { ProjectsRepo } from "@/db/repo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await ProjectsRepo.bySlug(slug);
  return { title: project ? project.title : "Project" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await ProjectsRepo.bySlug(slug);
  if (!project || !project.published) notFound();

  const stack = JSON.parse(project.tech_stack || "[]") as string[];

  return (
    <Section className="max-w-3xl">
      <Breadcrumbs
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: project.title }]}
      />

      <Reveal>
        <Mirror>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">{project.title}</h1>
        </Mirror>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {stack.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        <div className="mt-5 flex gap-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              <GitFork className="h-4 w-4" /> Source
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Live demo
            </a>
          )}
        </div>

        {project.image_url && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl shadow-lg shadow-black/[0.08]">
            <Image src={project.image_url} alt={project.title} fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
          </div>
        )}

        <p className="mt-8 text-[15px] leading-relaxed text-fg-muted">{project.description}</p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
        {project.problem && (
          <RevealItem>
            <p className="font-mono text-xs uppercase tracking-wider text-accent-tertiary">Problem</p>
            <p className="mt-2 text-sm leading-relaxed text-fg">{project.problem}</p>
          </RevealItem>
        )}
        {project.solution && (
          <RevealItem>
            <p className="font-mono text-xs uppercase tracking-wider text-accent-secondary">Solution</p>
            <p className="mt-2 text-sm leading-relaxed text-fg">{project.solution}</p>
          </RevealItem>
        )}
        {project.impact && (
          <RevealItem>
            <p className="font-mono text-xs uppercase tracking-wider text-accent">Impact</p>
            <p className="mt-2 text-sm leading-relaxed text-fg">{project.impact}</p>
          </RevealItem>
        )}
      </RevealGroup>
    </Section>
  );
}
