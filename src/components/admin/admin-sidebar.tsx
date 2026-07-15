"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import { Avatar } from "@/components/ui/primitives";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/cyber", label: "Cyber Lab", icon: ShieldCheck },
  { href: "/admin/experiences", label: "Experiences", icon: Sparkles },
  { href: "/admin/reflections", label: "Reflections", icon: BookOpen },
  { href: "/admin/cv", label: "Profile & CV", icon: FileUser },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminSidebar({
  name,
  email,
  photoUrl,
}: {
  name: string;
  email: string;
  photoUrl?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="glass-strong flex shrink-0 flex-col rounded-b-2xl md:w-64 md:rounded-b-none md:rounded-r-3xl">
      <div className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-6">
        <Avatar src={photoUrl} alt={name} size={40} />
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-medium text-fg">{name}</p>
          <p className="truncate text-xs text-fg-subtle">{email}</p>
        </div>
      </div>

      <nav className="scrollbar-thin flex gap-1 overflow-x-auto px-4 pb-3 md:flex-1 md:flex-col md:overflow-visible md:pb-0">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm transition-colors",
                active ? "font-medium text-accent" : "text-fg-muted hover:text-fg"
              )}
            >
              {active && (
                <motion.span
                  layoutId="admin-nav-pill"
                  className="absolute inset-0 rounded-full bg-accent/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="relative h-4 w-4 shrink-0" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="scrollbar-thin flex shrink-0 gap-1 overflow-x-auto border-t border-border px-4 py-3 md:flex-col md:overflow-visible md:py-4">
        <Link
          href="/"
          target="_blank"
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <Globe className="h-4 w-4 shrink-0" /> View site
        </Link>
        <button
          onClick={logout}
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full px-3.5 py-2.5 text-left text-sm text-fg-muted transition-colors hover:text-danger"
        >
          <LogOut className="h-4 w-4 shrink-0" /> Sign out
        </button>
      </div>
    </aside>
  );
}
