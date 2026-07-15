import { notFound } from "next/navigation";
import { CyberRepo } from "@/db/repo";
import { CyberForm } from "@/components/admin/cyber-form";

export default async function EditCyberEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await CyberRepo.byId(Number(id));
  if (!entry) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Edit cyber lab entry</h1>
      <div className="mt-8">
        <CyberForm
          entryId={entry.id}
          initial={{
            title: entry.title,
            description: entry.description,
            category: entry.category,
            tools_used: JSON.parse(entry.tools_used || "[]"),
            logs_analysis: entry.logs_analysis || "",
            what_i_learned: entry.what_i_learned || "",
            image_url: entry.image_url ?? "",
            featured: !!entry.featured,
            published: !!entry.published,
          }}
        />
      </div>
    </div>
  );
}
