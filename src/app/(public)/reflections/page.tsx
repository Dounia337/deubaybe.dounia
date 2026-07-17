import { BookOpen } from "lucide-react";
import { PageHeader, Section, EmptyState } from "@/components/ui/primitives";
import { ReflectionsExplorer } from "@/components/reflections-explorer";
import { ReflectionsRepo } from "@/db/repo";

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
          <EmptyState
            icon={<BookOpen />}
            title="Coming soon"
            description="New stories and reflections are being prepared. Stay tuned."
          />
        ) : (
          <ReflectionsExplorer reflections={reflections} />
        )}
      </Section>
    </>
  );
}
