import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Section, Chip, Breadcrumbs, Button } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { ImmersiveImage } from "@/components/immersive-image";
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
        <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">{project.title}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {stack.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {project.github_url && (
            <Button href={project.github_url} external variant="secondary">
              <FaGithub className="h-4 w-4" /> View source
            </Button>
          )}
          {project.demo_url && (
            <Button href={project.demo_url} external variant="primary">
              <ExternalLink className="h-4 w-4" /> Live demo
            </Button>
          )}
        </div>
      </Reveal>

      {project.image_url && (
        <Reveal delay={0.1}>
          <div className="mt-8">
            <ImmersiveImage src={project.image_url} alt={project.title} priority />
          </div>
        </Reveal>
      )}

      <Reveal delay={0.15}>
        <p className="mt-10 font-display text-xl font-semibold tracking-tight text-fg">Overview</p>
        <p className="mt-3 text-[17px] leading-[1.85] text-fg-muted">{project.description}</p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
        {project.problem && (
          <RevealItem>
            <p className="font-display text-xl font-semibold tracking-tight text-accent-tertiary">Problem</p>
            <p className="mt-3 text-base leading-relaxed text-fg">{project.problem}</p>
          </RevealItem>
        )}
        {project.solution && (
          <RevealItem>
            <p className="font-display text-xl font-semibold tracking-tight text-accent-secondary">Solution</p>
            <p className="mt-3 text-base leading-relaxed text-fg">{project.solution}</p>
          </RevealItem>
        )}
        {project.impact && (
          <RevealItem>
            <p className="font-display text-xl font-semibold tracking-tight text-accent">Impact</p>
            <p className="mt-3 text-base leading-relaxed text-fg">{project.impact}</p>
          </RevealItem>
        )}
      </RevealGroup>
    </Section>
  );
}
