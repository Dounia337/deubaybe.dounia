import { notFound } from "next/navigation";
import Image from "next/image";
import { Section, Chip, Breadcrumbs } from "@/components/ui/primitives";
import { Reveal, Mirror } from "@/components/ui/motion";
import { ReflectionsRepo } from "@/db/repo";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reflection = await ReflectionsRepo.bySlug(slug);
  return { title: reflection ? reflection.title : "Reflection" };
}

export default async function ReflectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reflection = await ReflectionsRepo.bySlug(slug);
  if (!reflection || !reflection.published) notFound();

  const tags = JSON.parse(reflection.tags || "[]") as string[];
  const paragraphs = reflection.content.split(/\n{2,}/);

  return (
    <Section className="max-w-2xl">
      <Breadcrumbs
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "Reflections", href: "/reflections" }, { label: reflection.title }]}
      />

      <Reveal>
        <p className="font-mono text-xs text-fg-subtle">{formatDate(reflection.post_date)}</p>
        <Mirror className="mt-2">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">{reflection.title}</h1>
        </Mirror>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        {reflection.image_url && (
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl shadow-lg shadow-black/[0.08]">
            <Image src={reflection.image_url} alt={reflection.title} fill sizes="(min-width: 768px) 640px, 100vw" className="object-cover" />
          </div>
        )}

        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-fg-muted">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
