import { PageHeader, Section, EmptyState } from "@/components/ui/primitives";
import { ProjectsExplorer } from "@/components/projects-explorer";
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
          <ProjectsExplorer projects={projects} />
        )}
      </Section>
    </>
  );
}
