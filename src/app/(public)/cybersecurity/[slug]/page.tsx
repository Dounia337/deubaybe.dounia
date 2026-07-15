import { notFound } from "next/navigation";
import Image from "next/image";
import { Section, Chip, Breadcrumbs } from "@/components/ui/primitives";
import { Reveal, Mirror } from "@/components/ui/motion";
import { CyberRepo } from "@/db/repo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await CyberRepo.bySlug(slug);
  return { title: entry ? entry.title : "Cyber Lab Entry" };
}

export default async function CyberEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await CyberRepo.bySlug(slug);
  if (!entry || !entry.published) notFound();

  const tools = JSON.parse(entry.tools_used || "[]") as string[];

  return (
    <Section className="max-w-3xl">
      <Breadcrumbs
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "Cyber Lab", href: "/cybersecurity" }, { label: entry.title }]}
      />

      <Reveal>
        <Chip>{entry.category}</Chip>
        <Mirror className="mt-4">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">{entry.title}</h1>
        </Mirror>

        {entry.image_url && (
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl shadow-lg shadow-black/[0.08]">
            <Image src={entry.image_url} alt={entry.title} fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
          </div>
        )}

        <p className="mt-6 text-[15px] leading-relaxed text-fg-muted">{entry.description}</p>

        {tools.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {tools.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        )}
      </Reveal>

      {entry.logs_analysis && (
        <Reveal className="mt-10">
          <p className="font-mono text-xs uppercase tracking-wider text-accent-secondary">Log analysis</p>
          <pre className="scrollbar-thin mt-3 overflow-x-auto rounded-2xl border border-border bg-bg-sunken p-4 font-mono text-[13px] leading-relaxed text-fg whitespace-pre-wrap">
            {entry.logs_analysis}
          </pre>
        </Reveal>
      )}

      {entry.what_i_learned && (
        <Reveal className="mt-8 rounded-2xl border border-accent/25 bg-accent/[0.06] p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">What I learned</p>
          <p className="mt-2 text-sm leading-relaxed text-fg">{entry.what_i_learned}</p>
        </Reveal>
      )}
    </Section>
  );
}
