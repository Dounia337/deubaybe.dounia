import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Section, Chip, Breadcrumbs } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { ReadingProgress } from "@/components/reading-progress";
import { ShareButtons } from "@/components/share-buttons";
import { RelatedReflections } from "@/components/related-reflections";
import { ReflectionsRepo } from "@/db/repo";
import { formatDate, estimateReadingTime } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reflection = await ReflectionsRepo.bySlug(slug);
  return { title: reflection ? reflection.title : "Reflection" };
}

export default async function ReflectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [reflection, allReflections] = await Promise.all([
    ReflectionsRepo.bySlug(slug),
    ReflectionsRepo.all(true),
  ]);
  if (!reflection || !reflection.published) notFound();

  const tags = JSON.parse(reflection.tags || "[]") as string[];
  const paragraphs = reflection.content.split(/\n{2,}/);
  const readingTime = estimateReadingTime(reflection.content);

  const others = allReflections.filter((r) => r.id !== reflection.id);
  const scored = others
    .map((r) => {
      const rTags = JSON.parse(r.tags || "[]") as string[];
      const shared = rTags.filter((t) => tags.includes(t)).length;
      return { r, shared };
    })
    .sort((a, b) => b.shared - a.shared || (a.r.post_date < b.r.post_date ? 1 : -1));
  const related = scored.slice(0, 3).map((s) => s.r);

  return (
    <>
      <ReadingProgress />
      <Section className="max-w-3xl">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: "Home", href: "/" }, { label: "Reflections", href: "/reflections" }, { label: reflection.title }]}
        />

        <Reveal>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-fg-subtle">
            <span>{formatDate(reflection.post_date)}</span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {readingTime} min read
            </span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
            {reflection.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <ShareButtons title={reflection.title} />
          </div>
        </Reveal>

        {reflection.image_url && (
          <Reveal delay={0.1}>
            <div className="relative mt-8 flex h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl bg-bg-sunken shadow-xl shadow-black/[0.1] ring-1 ring-border sm:h-[440px] md:h-[560px]">
              <Image
                src={reflection.image_url}
                alt={reflection.title}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                priority
                className="object-contain"
              />
            </div>
          </Reveal>
        )}

        <Reveal delay={0.15}>
          <div className="mt-10 space-y-5 text-base leading-relaxed text-fg-muted">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        <RelatedReflections items={related} />
      </Section>
    </>
  );
}
