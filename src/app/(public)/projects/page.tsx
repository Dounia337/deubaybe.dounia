import { FolderGit2 } from "lucide-react";
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
      <Section className="hero-wash">
        {projects.length === 0 ? (
          <EmptyState
            icon={<FolderGit2 />}
            title="Coming soon"
            description="New projects are being prepared. Stay tuned."
          />
        ) : (
          <ProjectsExplorer projects={projects} />
        )}
      </Section>
    </>
  );
}
