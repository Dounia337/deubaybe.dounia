"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  ShieldCheck,
  Sparkles,
  BookOpen,
  FileUser,
  Mail,
  LogOut,
  Globe,
} from "lucide-react";
import { cx } from "@/lib/format";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/cyber", label: "Cyber Lab", icon: ShieldCheck },
  { href: "/admin/experiences", label: "Experiences", icon: Sparkles },
  { href: "/admin/reflections", label: "Reflections", icon: BookOpen },
  { href: "/admin/cv", label: "Profile & CV", icon: FileUser },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-bg-sunken/40 px-4 py-6">
      <div className="mb-8 px-2">
        <p className="font-display text-sm font-medium text-fg">{name}</p>
        <p className="truncate font-mono text-xs text-fg-subtle">{email}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors",
                active ? "bg-accent/10 text-accent" : "text-fg-muted hover:bg-bg-elevated hover:text-fg"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-fg-muted hover:bg-bg-elevated hover:text-fg"
        >
          <Globe className="h-4 w-4" /> View site
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm text-fg-muted hover:bg-bg-elevated hover:text-danger"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
