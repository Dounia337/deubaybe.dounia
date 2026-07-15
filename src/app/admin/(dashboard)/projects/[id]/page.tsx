import { notFound } from "next/navigation";
import { ProjectsRepo } from "@/db/repo";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await ProjectsRepo.byId(Number(id));
  if (!project) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Edit project</h1>
      <div className="mt-8">
        <ProjectForm
          projectId={project.id}
          initial={{
            title: project.title,
            description: project.description,
            problem: project.problem || "",
            solution: project.solution || "",
            impact: project.impact || "",
            tech_stack: JSON.parse(project.tech_stack || "[]"),
            image_url: project.image_url || "",
            github_url: project.github_url || "",
            demo_url: project.demo_url || "",
            featured: !!project.featured,
            published: !!project.published,
          }}
        />
      </div>
    </div>
  );
}
