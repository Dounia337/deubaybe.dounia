import Image from "next/image";
import { Sparkles } from "lucide-react";
import { PageHeader, Section, Card, Chip, EmptyState } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { ExperiencesRepo } from "@/db/repo";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Experiences" };

export default async function ExperiencesPage() {
  const experiences = await ExperiencesRepo.all(true);

  return (
    <>
      <PageHeader
        eyebrow="Experiences"
        title="Trainings, conferences & leadership"
        description="Convenings, workshops, and leadership moments — each with what I actually took away from it."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Experiences" }]}
      />
      <Section>
        {experiences.length === 0 ? (
          <EmptyState title="No experiences logged yet" />
        ) : (
          <ol className="relative space-y-6 border-l border-border pl-8">
            {experiences.map((e) => (
              <li key={e.id} className="relative">
                <span className="absolute -left-[38px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-bg bg-accent-tertiary" />
                <Reveal>
                  <Card className="flex flex-col gap-5 sm:flex-row">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-bg-sunken sm:h-28 sm:w-28">
                      {e.image_url ? (
                        <Image src={e.image_url} alt={e.title} fill sizes="112px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-tertiary/15 via-transparent to-accent/15">
                          <Sparkles className="h-7 w-7 text-accent-tertiary" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-display text-xl font-medium text-fg">{e.title}</h3>
                        <span className="text-xs text-fg-subtle">{formatDate(e.event_date)}</span>
                      </div>
                      <Chip>{e.type}</Chip>
                      <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">{e.description}</p>
                      {e.key_takeaway && (
                        <p className="mt-3 border-t border-border pt-3 text-sm text-fg">
                          <span className="font-mono text-xs uppercase tracking-wider text-accent">
                            Key takeaway —{" "}
                          </span>
                          {e.key_takeaway}
                        </p>
                      )}
                    </div>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ol>
        )}
      </Section>
    </>
  );
}
