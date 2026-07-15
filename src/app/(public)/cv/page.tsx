import { Download, Mail, Phone, MapPin } from "lucide-react";
import { PageHeader, Section, Card, Chip, Button, Avatar } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { CVRepo } from "@/db/repo";
import { formatMonthYear } from "@/lib/format";

export const metadata = { title: "CV" };

export default async function CVPage() {
  const [profile, education, experience, skills, leadership] = await Promise.all([
    CVRepo.profile(),
    CVRepo.education(),
    CVRepo.experience(),
    CVRepo.skills(),
    CVRepo.leadership(),
  ]);
  const links = JSON.parse(profile.links || "[]") as { label: string; url: string }[];

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        eyebrow="Curriculum Vitae"
        title={profile.full_name}
        description={profile.headline}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "CV" }]}
      />

      <Section className="max-w-3xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar src={profile.photo_url} alt={profile.full_name} size={64} />
            <div className="flex flex-wrap gap-4 text-sm text-fg-muted">
              {profile.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {profile.email}
                </span>
              )}
              {profile.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {profile.phone}
                </span>
              )}
              {profile.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </span>
              )}
            </div>
          </div>
          <Button href="/api/cv/pdf" variant="primary">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>

        {profile.summary && (
          <Reveal>
            <Card className="mb-8">
              <p className="text-base leading-relaxed text-fg-muted">{profile.summary}</p>
              {links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
                  {links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-accent underline-offset-4 transition-colors hover:text-accent-secondary hover:underline"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </Card>
          </Reveal>
        )}

        {education.length > 0 && (
          <Reveal className="mb-10">
            <h2 className="mb-4 font-display text-xl font-semibold tracking-tight text-fg">Education</h2>
            <div className="space-y-3">
              {education.map((e) => (
                <Card key={e.id}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-fg">{e.institution}</p>
                      <p className="text-sm text-fg-muted">
                        {e.degree}
                        {e.field ? `, ${e.field}` : ""}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-fg-subtle">
                      {formatMonthYear(e.start_date)} – {formatMonthYear(e.end_date)}
                    </span>
                  </div>
                  {e.description && <p className="mt-2 text-base leading-relaxed text-fg-muted">{e.description}</p>}
                </Card>
              ))}
            </div>
          </Reveal>
        )}

        {experience.length > 0 && (
          <Reveal className="mb-10">
            <h2 className="mb-4 font-display text-xl font-semibold tracking-tight text-fg">Experience</h2>
            <div className="space-y-3">
              {experience.map((e) => (
                <Card key={e.id}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-fg">{e.role}</p>
                      <p className="text-sm text-fg-muted">{e.organization}</p>
                    </div>
                    <span className="font-mono text-xs text-fg-subtle">
                      {formatMonthYear(e.start_date)} – {formatMonthYear(e.end_date)}
                    </span>
                  </div>
                  {e.description && <p className="mt-2 text-base leading-relaxed text-fg-muted">{e.description}</p>}
                </Card>
              ))}
            </div>
          </Reveal>
        )}

        {leadership.length > 0 && (
          <Reveal className="mb-10">
            <h2 className="mb-4 font-display text-xl font-semibold tracking-tight text-fg">Leadership</h2>
            <div className="space-y-3">
              {leadership.map((e) => (
                <Card key={e.id}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-fg">{e.role}</p>
                      <p className="text-sm text-fg-muted">{e.organization}</p>
                    </div>
                    <span className="font-mono text-xs text-fg-subtle">
                      {formatMonthYear(e.start_date)} – {formatMonthYear(e.end_date)}
                    </span>
                  </div>
                  {e.description && <p className="mt-2 text-base leading-relaxed text-fg-muted">{e.description}</p>}
                </Card>
              ))}
            </div>
          </Reveal>
        )}

        {skills.length > 0 && (
          <Reveal>
            <h2 className="mb-4 font-display text-xl font-semibold tracking-tight text-fg">Skills</h2>
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category}>
                  <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((s) => (
                      <Chip key={s.id}>{s.name}</Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </Section>
    </>
  );
}
