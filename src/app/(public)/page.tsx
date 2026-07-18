import { ArrowUpRight, ShieldCheck, FolderGit2, Sparkles, BookOpen } from "lucide-react";
import { ProfileHero } from "@/components/profile-hero";
import { Section, Eyebrow, OverlayCard, Button } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem, Parallax } from "@/components/ui/motion";
import {
  ProjectsRepo,
  CyberRepo,
  ExperiencesRepo,
  ReflectionsRepo,
  CVRepo,
  SocialLinksRepo,
  FeaturedRepo,
  HeroRolesRepo,
  QuoteRepo,
} from "@/db/repo";
import { formatDate } from "@/lib/format";

export default async function HomePage() {
  const [
    profile,
    allProjects,
    allCyberEntries,
    allExperiences,
    allReflections,
    allSocialLinks,
    featured,
    heroRoles,
    quote,
  ] = await Promise.all([
    CVRepo.profile(),
    ProjectsRepo.all(true),
    CyberRepo.all(true),
    ExperiencesRepo.all(true),
    ReflectionsRepo.all(true),
    SocialLinksRepo.all(),
    FeaturedRepo.all(),
    HeroRolesRepo.all(),
    QuoteRepo.get(),
  ]);
  const socialLinks = allSocialLinks.filter((l) => l.visible && l.url.trim());
  const projects = allProjects.slice(0, 3);
  const cyberEntries = allCyberEntries.slice(0, 2);
  const experiences = allExperiences.slice(0, 3);
  const reflections = allReflections.slice(0, 2);

  return (
    <>
      <ProfileHero
        name={profile.full_name}
        headline={profile.headline}
        photoUrl={profile.photo_url}
        socialLinks={socialLinks}
        featured={featured}
        roles={heroRoles.map((r) => r.text)}
      />

      {/* Experiences preview — moved first after the hero so the homepage tells "who I am /
          what I've experienced" before "what I've built": credibility and journey lead,
          projects follow. Whole section is skipped when there's nothing published yet, so the
          homepage never shows a placeholder; empty states only live on the dedicated listing
          pages, reached by intentional navigation. */}
      {experiences.length > 0 && (
        <Section className="hero-wash">
          <Reveal className="mx-auto mb-10 max-w-xl text-center">
            <Parallax offset={14}>
              <Eyebrow>Experiences</Eyebrow>
              <h2 className="mt-2 font-display text-4xl font-semibold text-fg sm:text-5xl">Trainings &amp; convenings</h2>
            </Parallax>
            <div className="mt-5">
              <Button href="/experiences" variant="ghost">
                Full timeline <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Reveal>

          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((e) => (
              <RevealItem key={e.id}>
                <OverlayCard
                  href={`/experiences#experience-${e.id}`}
                  linkScroll={false}
                  src={e.image_url}
                  alt={e.title}
                  icon={<Sparkles />}
                  category={e.type}
                  title={e.title}
                  date={formatDate(e.event_date)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      {/* Projects preview */}
      {projects.length > 0 && (
        <Section className="hero-wash">
          <Reveal className="mx-auto mb-10 max-w-xl text-center">
            <Parallax offset={14}>
              <Eyebrow>Projects</Eyebrow>
              <h2 className="mt-2 font-display text-4xl font-semibold text-fg sm:text-5xl">Things I&apos;ve built</h2>
            </Parallax>
            <div className="mt-5">
              <Button href="/projects" variant="ghost">
                All projects <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Reveal>

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
        </Section>
      )}

      {/* Cybersecurity preview */}
      {cyberEntries.length > 0 && (
        <Section className="hero-wash">
          <Reveal className="mx-auto mb-10 max-w-xl text-center">
            <Parallax offset={14}>
              <Eyebrow>Cyber Lab</Eyebrow>
              <h2 className="mt-2 font-display text-4xl font-semibold text-fg sm:text-5xl">Blue team notes</h2>
            </Parallax>
            <div className="mt-5">
              <Button href="/cybersecurity" variant="ghost">
                Full lab <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Reveal>

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
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      {/* Reflections preview */}
      {reflections.length > 0 && (
        <Section className="hero-wash">
          <Reveal className="mx-auto mb-10 max-w-xl text-center">
            <Parallax offset={14}>
              <Eyebrow>Reflections</Eyebrow>
              <h2 className="mt-2 font-display text-4xl font-semibold text-fg sm:text-5xl">Recent writing</h2>
            </Parallax>
            <div className="mt-5">
              <Button href="/reflections" variant="ghost">
                All reflections <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Reveal>

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
        </Section>
      )}

      {/* Closing quote — a quiet last note before the footer, not another content grid. Hidden
          entirely (no placeholder) when the admin hasn't set one. Reuses hero-wash for the same
          soft, borderless atmosphere as every other section, and extra vertical padding so it
          reads as a deliberate pause rather than just one more block in the scroll. */}
      {quote.quote.trim() && (
        <Section className="hero-wash">
          <Reveal className="mx-auto max-w-2xl py-10 text-center sm:py-14">
            {quote.show_label ? (
              <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle/70">
                Quote of the Week
              </p>
            ) : null}
            <p className="font-display text-2xl italic font-normal leading-relaxed text-fg sm:text-3xl md:text-[2.25rem] md:leading-[1.5]">
              &ldquo;{quote.quote}&rdquo;
            </p>
            {quote.author.trim() && <p className="mt-6 text-sm text-fg-subtle">— {quote.author}</p>}
          </Reveal>
        </Section>
      )}
    </>
  );
}
