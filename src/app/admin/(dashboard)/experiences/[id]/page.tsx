import { notFound } from "next/navigation";
import { ExperiencesRepo } from "@/db/repo";
import { ExperienceForm } from "@/components/admin/experience-form";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = await ExperiencesRepo.byId(Number(id));
  if (!experience) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Edit experience</h1>
      <div className="mt-8">
        <ExperienceForm
          experienceId={experience.id}
          initial={{
            title: experience.title,
            type: experience.type,
            event_date: experience.event_date,
            description: experience.description,
            key_takeaway: experience.key_takeaway || "",
            image_url: experience.image_url || "",
            published: !!experience.published,
          }}
        />
      </div>
    </div>
  );
}
