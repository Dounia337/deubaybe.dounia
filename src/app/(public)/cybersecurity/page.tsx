import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PageHeader, Section, MediaCard, CardMedia, Chip, EmptyState } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { CyberRepo } from "@/db/repo";
import { truncate } from "@/lib/format";

export const metadata = { title: "Cyber Lab" };

export default async function CyberLabPage() {
  const entries = await CyberRepo.all(true);

  return (
    <>
      <PageHeader
        eyebrow="Cyber Lab"
        title="Blue team learning log"
        description="Log analysis, incident writeups, and tools from my hands-on security lab — Splunk, Sysmon, pfSense, OWASP ZAP, and more."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cyber Lab" }]}
      />
      <Section>
        {entries.length === 0 ? (
          <EmptyState title="No lab entries published yet" />
        ) : (
          <RevealGroup className="grid gap-5 sm:grid-cols-2">
            {entries.map((c) => {
              const tools = JSON.parse(c.tools_used || "[]") as string[];
              return (
                <RevealItem key={c.id}>
                  <Link href={`/cybersecurity/${c.slug}`}>
                    <MediaCard
                      className="h-full"
                      media={<CardMedia src={c.image_url} alt={c.title} icon={<ShieldCheck />} />}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-medium text-fg group-hover:text-accent">
                          {c.title}
                        </h3>
                        <Chip>{c.category}</Chip>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                        {truncate(c.description, 140)}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {tools.slice(0, 4).map((t) => (
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
