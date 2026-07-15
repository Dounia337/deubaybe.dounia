import { ExperienceForm } from "@/components/admin/experience-form";

export default function NewExperiencePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">New experience</h1>
      <div className="mt-8">
        <ExperienceForm />
      </div>
    </div>
  );
}
