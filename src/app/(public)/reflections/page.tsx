import { BookOpen } from "lucide-react";
import { PageHeader, Section, OverlayCard, EmptyState } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { ReflectionsRepo } from "@/db/repo";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Reflections" };

export default async function ReflectionsPage() {
  const reflections = await ReflectionsRepo.all(true);

  return (
    <>
      <PageHeader
        eyebrow="Reflections"
        title="Notes on growth"
        description="Writing on leadership, tech, and the in-between moments of building things that matter."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reflections" }]}
      />
      <Section>
        {reflections.length === 0 ? (
          <EmptyState title="No reflections published yet" />
        ) : (
          <RevealGroup className="grid gap-5 sm:grid-cols-2">
            {reflections.map((r) => {
              const tags = JSON.parse(r.tags || "[]") as string[];
              return (
                <RevealItem key={r.id}>
                  <OverlayCard
                    href={`/reflections/${r.slug}`}
                    src={r.image_url}
                    alt={r.title}
                    icon={<BookOpen />}
                    title={r.title}
                    tags={tags}
                    date={formatDate(r.post_date)}
                  />
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </Section>
    </>
  );
}
