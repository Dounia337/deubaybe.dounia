import Link from "next/link";
import { ArrowUpRight, ShieldCheck, FolderGit2, Sparkles, BookOpen } from "lucide-react";
import { ProfileHero } from "@/components/profile-hero";
import { Section, Eyebrow, MediaCard, CardMedia, Chip, Button, EmptyState } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem, Parallax, Mirror } from "@/components/ui/motion";
import { ProjectsRepo, CyberRepo, ExperiencesRepo, ReflectionsRepo, CVRepo } from "@/db/repo";
import { formatDate, truncate } from "@/lib/format";

export default async function HomePage() {
  const [profile, allProjects, allCyberEntries, allExperiences, allReflections] = await Promise.all([
    CVRepo.profile(),
    ProjectsRepo.all(true),
    CyberRepo.all(true),
    ExperiencesRepo.all(true),
    ReflectionsRepo.all(true),
  ]);
  const projects = allProjects.slice(0, 3);
  const cyberEntries = allCyberEntries.slice(0, 2);
  const experiences = allExperiences.slice(0, 3);
  const reflections = allReflections.slice(0, 2);

  return (
    <>
      <ProfileHero name={profile.full_name} headline={profile.headline} photoUrl={profile.photo_url} />

      {/* Projects preview */}
      <Section>
        <Reveal className="mx-auto mb-10 max-w-xl text-center">
          <Parallax offset={14}>
            <Eyebrow>Projects</Eyebrow>
            <Mirror className="mt-2">
              <h2 className="font-display text-3xl font-semibold text-fg sm:text-4xl">Things I&apos;ve built</h2>
            </Mirror>
          </Parallax>
          <div className="mt-5">
            <Button href="/projects" variant="ghost">
              All projects <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Reveal>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects published yet"
            description="Add your first project from the admin panel — it'll show up here automatically."
          />
        ) : (
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <RevealItem key={p.id}>
                <Link href={`/projects/${p.slug}`}>
                  <MediaCard
                    className="h-full"
                    media={<CardMedia src={p.image_url} alt={p.title} icon={<FolderGit2 />} />}
                  >
                    <h3 className="font-display text-lg font-medium text-fg group-hover:text-accent">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                      {truncate(p.description, 110)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(JSON.parse(p.tech_stack || "[]") as string[]).slice(0, 3).map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  </MediaCard>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Section>

      {/* Cybersecurity preview */}
      <Section>
        <Reveal className="mx-auto mb-10 max-w-xl text-center">
          <Parallax offset={14}>
            <Eyebrow>Cyber Lab</Eyebrow>
            <Mirror className="mt-2">
              <h2 className="font-display text-3xl font-semibold text-fg sm:text-4xl">Blue team notes</h2>
            </Mirror>
          </Parallax>
          <div className="mt-5">
            <Button href="/cybersecurity" variant="ghost">
              Full lab <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Reveal>

        {cyberEntries.length === 0 ? (
          <EmptyState title="No lab entries yet" description="Log your first blue-team writeup from the admin panel." />
        ) : (
          <RevealGroup className="grid gap-4 sm:grid-cols-2">
            {cyberEntries.map((c) => (
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
                      {truncate(c.description, 130)}
                    </p>
                  </MediaCard>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Section>

      {/* Experiences preview */}
      <Section>
        <Reveal className="mx-auto mb-10 max-w-xl text-center">
          <Parallax offset={14}>
            <Eyebrow>Experiences</Eyebrow>
            <Mirror className="mt-2">
              <h2 className="font-display text-3xl font-semibold text-fg sm:text-4xl">Trainings &amp; convenings</h2>
            </Mirror>
          </Parallax>
          <div className="mt-5">
            <Button href="/experiences" variant="ghost">
              Full timeline <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Reveal>

        {experiences.length === 0 ? (
          <EmptyState title="No experiences logged yet" />
        ) : (
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((e) => (
              <RevealItem key={e.id}>
                <MediaCard media={<CardMedia src={e.image_url} alt={e.title} icon={<Sparkles />} aspect="aspect-video" />}>
                  <p className="font-medium text-fg">{e.title}</p>
                  <p className="mt-1 text-sm text-fg-muted">{truncate(e.description, 100)}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-fg-subtle">
                    <Chip>{e.type}</Chip>
                    {formatDate(e.event_date)}
                  </div>
                </MediaCard>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Section>

      {/* Reflections preview */}
      <Section>
        <Reveal className="mx-auto mb-10 max-w-xl text-center">
          <Parallax offset={14}>
            <Eyebrow>Reflections</Eyebrow>
            <Mirror className="mt-2">
              <h2 className="font-display text-3xl font-semibold text-fg sm:text-4xl">Recent writing</h2>
            </Mirror>
          </Parallax>
          <div className="mt-5">
            <Button href="/reflections" variant="ghost">
              All reflections <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Reveal>

        {reflections.length === 0 ? (
          <EmptyState title="No reflections published yet" />
        ) : (
          <RevealGroup className="grid gap-4 sm:grid-cols-2">
            {reflections.map((r) => (
              <RevealItem key={r.id}>
                <Link href={`/reflections/${r.slug}`}>
                  <MediaCard
                    className="h-full"
                    media={<CardMedia src={r.image_url} alt={r.title} icon={<BookOpen />} />}
                  >
                    <h3 className="font-display text-lg font-medium text-fg group-hover:text-accent">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                      {truncate(r.content.replace(/[#*_>`]/g, ""), 130)}
                    </p>
                    <p className="mt-4 text-xs text-fg-subtle">{formatDate(r.post_date)}</p>
                  </MediaCard>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Section>
    </>
  );
}
