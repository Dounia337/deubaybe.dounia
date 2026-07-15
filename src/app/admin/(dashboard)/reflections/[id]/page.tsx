import { notFound } from "next/navigation";
import { ReflectionsRepo } from "@/db/repo";
import { ReflectionForm } from "@/components/admin/reflection-form";

export default async function EditReflectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reflection = await ReflectionsRepo.byId(Number(id));
  if (!reflection) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Edit reflection</h1>
      <div className="mt-8">
        <ReflectionForm
          reflectionId={reflection.id}
          initial={{
            title: reflection.title,
            content: reflection.content,
            tags: JSON.parse(reflection.tags || "[]"),
            image_url: reflection.image_url ?? "",
            post_date: reflection.post_date,
            published: !!reflection.published,
          }}
        />
      </div>
    </div>
  );
}
