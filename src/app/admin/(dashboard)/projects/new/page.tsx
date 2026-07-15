import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">New project</h1>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
