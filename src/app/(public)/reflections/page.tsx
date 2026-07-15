import Link from "next/link";
import { BookOpen } from "lucide-react";
import { PageHeader, Section, MediaCard, CardMedia, Chip, EmptyState } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { ReflectionsRepo } from "@/db/repo";
import { formatDate, truncate } from "@/lib/format";

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
                  <Link href={`/reflections/${r.slug}`}>
                    <MediaCard
                      className="h-full"
                      media={<CardMedia src={r.image_url} alt={r.title} icon={<BookOpen />} />}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-medium text-fg group-hover:text-accent">
                          {r.title}
                        </h3>
                        <span className="text-xs text-fg-subtle">{formatDate(r.post_date)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                        {truncate(r.content.replace(/[#*_>`]/g, ""), 150)}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {tags.map((t) => (
                          <Chip key={t}>{t}</Chip>
                        ))}
                      </div>
                    </MediaCard>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </Section>
    </>
  );
}
