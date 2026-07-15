import Link from "next/link";
import { FolderGit2, ShieldCheck, Sparkles, BookOpen, Mail, Pencil } from "lucide-react";
import { ProjectsRepo, CyberRepo, ExperiencesRepo, ReflectionsRepo, MessagesRepo, CVRepo } from "@/db/repo";
import { Card, Avatar, Button } from "@/components/ui/primitives";

export default async function AdminDashboardPage() {
  const [profile, projects, cyberEntries, experiences, reflections, messages, unreadCount] = await Promise.all([
    CVRepo.profile(),
    ProjectsRepo.all(false),
    CyberRepo.all(false),
    ExperiencesRepo.all(false),
    ReflectionsRepo.all(false),
    MessagesRepo.all(),
    MessagesRepo.unreadCount(),
  ]);
  const stats = [
    {
      label: "Projects",
      value: projects.length,
      href: "/admin/projects",
      icon: FolderGit2,
      color: "text-accent-secondary",
    },
    {
      label: "Cyber lab entries",
      value: cyberEntries.length,
      href: "/admin/cyber",
      icon: ShieldCheck,
      color: "text-accent",
    },
    {
      label: "Experiences",
      value: experiences.length,
      href: "/admin/experiences",
      icon: Sparkles,
      color: "text-accent-tertiary",
    },
    {
      label: "Reflections",
      value: reflections.length,
      href: "/admin/reflections",
      icon: BookOpen,
      color: "text-accent-tertiary",
    },
    {
      label: "Messages",
      value: messages.length,
      sub: `${unreadCount} unread`,
      href: "/admin/messages",
      icon: Mail,
      color: "text-accent-secondary",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Dashboard</h1>
      <p className="mt-1 text-sm text-fg-muted">Overview of everything published on the site.</p>

      <Card className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar src={profile.photo_url} alt={profile.full_name} size={56} />
          <div>
            <p className="text-xs uppercase tracking-wider text-fg-subtle">Homepage hero</p>
            <p className="font-display text-lg font-medium text-fg">{profile.full_name}</p>
            <p className="text-sm text-fg-muted">{profile.headline}</p>
          </div>
        </div>
        <Button href="/admin/cv" variant="secondary">
          <Pencil className="h-3.5 w-3.5" /> Edit photo, name &amp; headline
        </Button>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="h-full">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <p className="mt-4 font-display text-3xl font-semibold text-fg">{s.value}</p>
              <p className="mt-1 text-sm text-fg-muted">{s.label}</p>
              {s.sub && <p className="mt-1 font-mono text-xs text-accent">{s.sub}</p>}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
