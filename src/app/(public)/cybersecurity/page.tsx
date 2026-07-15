import { ShieldCheck } from "lucide-react";
import { PageHeader, Section, OverlayCard, EmptyState } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { CyberRepo } from "@/db/repo";

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
            {entries.map((c) => (
              <RevealItem key={c.id}>
                <OverlayCard
                  href={`/cybersecurity/${c.slug}`}
                  src={c.image_url}
                  alt={c.title}
                  icon={<ShieldCheck />}
                  category={c.category}
                  title={c.title}
                  tags={(JSON.parse(c.tools_used || "[]") as string[]).slice(0, 3)}
                  aspect="aspect-[4/3]"
                />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Section>
    </>
  );
}
