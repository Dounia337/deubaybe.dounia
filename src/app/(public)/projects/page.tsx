import { FolderGit2 } from "lucide-react";
import { PageHeader, Section, OverlayCard, EmptyState } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { ProjectsRepo } from "@/db/repo";

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
            {projects.map((p) => (
              <RevealItem key={p.id}>
                <OverlayCard
                  href={`/projects/${p.slug}`}
                  src={p.image_url}
                  alt={p.title}
                  icon={<FolderGit2 />}
                  title={p.title}
                  tags={JSON.parse(p.tech_stack || "[]") as string[]}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Section>
    </>
  );
}
