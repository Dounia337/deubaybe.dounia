import { Sparkles } from "lucide-react";
import { PageHeader, Section, EmptyState } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { ExperienceCard } from "@/components/experience-card";
import { ScrollToHash } from "@/components/scroll-to-hash";
import { ExperiencesRepo } from "@/db/repo";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Experiences" };

export default async function ExperiencesPage() {
  const experiences = await ExperiencesRepo.all(true);

  return (
    <>
      <ScrollToHash />
      <PageHeader
        eyebrow="Experiences"
        title="Trainings, conferences & leadership"
        description="Convenings, workshops, and leadership moments — each with what I actually took away from it."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Experiences" }]}
      />
      <Section>
        {experiences.length === 0 ? (
          <EmptyState
            icon={<Sparkles />}
            title="Coming soon"
            description="New trainings and convenings are being prepared. Stay tuned."
          />
        ) : (
          <ol className="relative space-y-10 border-l border-border pl-8">
            {experiences.map((e) => (
              <li key={e.id} id={`experience-${e.id}`} className="relative">
                <span className="absolute -left-[38px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-bg bg-accent-tertiary" />
                <Reveal>
                  <ExperienceCard
                    title={e.title}
                    type={e.type}
                    date={formatDate(e.event_date)}
                    description={e.description}
                    keyTakeaway={e.key_takeaway}
                    imageUrl={e.image_url}
                  />
                </Reveal>
              </li>
            ))}
          </ol>
        )}
      </Section>
    </>
  );
}
