import Link from "next/link";
import { FolderGit2, GitFork, ExternalLink } from "lucide-react";
import { PageHeader, Section, MediaCard, CardMedia, Chip, EmptyState } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { ProjectsRepo } from "@/db/repo";
import { truncate } from "@/lib/format";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await ProjectsRepo.all(true);

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Things I've built"
        description="Problem, solution, and impact for each system I've shipped — from campus tools to platforms built for African contexts."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />
      <Section>
        {projects.length === 0 ? (
          <EmptyState title="No projects published yet" description="Check back soon." />
        ) : (
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const stack = JSON.parse(p.tech_stack || "[]") as string[];
              return (
                <RevealItem key={p.id}>
                  <MediaCard
                    className="flex h-full flex-col"
                    media={<CardMedia src={p.image_url} alt={p.title} icon={<FolderGit2 />} />}
                  >
                    <Link href={`/projects/${p.slug}`}>
                      <h3 className="font-display text-lg font-medium text-fg group-hover:text-accent">
                        {p.title}
                      </h3>
                    </Link>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
                      {truncate(p.description, 130)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {stack.slice(0, 4).map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-4 text-sm">
                      <Link href={`/projects/${p.slug}`} className="text-accent hover:underline">
                        Read more
                      </Link>
                      {p.github_url && (
                        <a
                          href={p.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-fg-subtle hover:text-fg"
                          aria-label="GitHub repository"
                        >
                          <GitFork className="h-4 w-4" />
                        </a>
                      )}
                      {p.demo_url && (
                        <a
                          href={p.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-fg-subtle hover:text-fg"
                          aria-label="Live demo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </MediaCard>
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </Section>
    </>
  );
}
