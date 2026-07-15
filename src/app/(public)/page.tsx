import { ArrowUpRight, ShieldCheck, FolderGit2, Sparkles, BookOpen } from "lucide-react";
import { ProfileHero } from "@/components/profile-hero";
import { Section, Eyebrow, OverlayCard, Button, EmptyState } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem, Parallax, Mirror } from "@/components/ui/motion";
import { ProjectsRepo, CyberRepo, ExperiencesRepo, ReflectionsRepo, CVRepo } from "@/db/repo";
import { formatDate } from "@/lib/format";

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
              <h2 className="font-display text-4xl font-semibold text-fg sm:text-5xl">Things I&apos;ve built</h2>
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
                <OverlayCard
                  href={`/projects/${p.slug}`}
                  src={p.image_url}
                  alt={p.title}
                  icon={<FolderGit2 />}
                  title={p.title}
                  tags={JSON.parse(p.tech_stack || "[]") as string[]}
                />
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
              <h2 className="font-display text-4xl font-semibold text-fg sm:text-5xl">Blue team notes</h2>
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
                <OverlayCard
                  href={`/cybersecurity/${c.slug}`}
                  src={c.image_url}
                  alt={c.title}
                  icon={<ShieldCheck />}
                  category={c.category}
                  title={c.title}
                  aspect="aspect-[4/3]"
                />
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
              <h2 className="font-display text-4xl font-semibold text-fg sm:text-5xl">Trainings &amp; convenings</h2>
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
                <OverlayCard
                  href="/experiences"
                  src={e.image_url}
                  alt={e.title}
                  icon={<Sparkles />}
                  category={e.type}
                  title={e.title}
                  date={formatDate(e.event_date)}
                  aspect="aspect-[4/3]"
                />
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
              <h2 className="font-display text-4xl font-semibold text-fg sm:text-5xl">Recent writing</h2>
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
            {reflections.map((r) => {
              const tags = JSON.parse(r.tags || "[]") as string[];
              return (
                <RevealItem key={r.id}>
                  <OverlayCard
                    href={`/reflections/${r.slug}`}
                    src={r.image_url}
                    alt={r.title}
                    icon={<BookOpen />}
                    title={r.title}
                    tags={tags}
                    date={formatDate(r.post_date)}
                  />
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </Section>
    </>
  );
}
