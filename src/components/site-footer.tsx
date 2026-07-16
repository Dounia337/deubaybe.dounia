import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav-links";
import { SOCIAL_ICONS, SOCIAL_LABELS } from "@/lib/social-icons";
import type { SocialPlatform } from "@/db/repo";

const CLOSING_LINKS = [
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter({
  siteName,
  headline,
  socialLinks = [],
}: {
  siteName: string;
  headline?: string | null;
  socialLinks?: { platform: SocialPlatform; url: string }[];
}) {
  return (
    <footer className="glass relative mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold text-fg">{siteName}</p>
            <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-fg-subtle">
              {headline || "Building thoughtfully, leading intentionally."}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">Explore</p>
            <nav className="mt-3 flex flex-col items-start gap-2.5">
              {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-fg-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">Connect</p>

            {socialLinks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {socialLinks.map((l) => {
                  const Icon = SOCIAL_ICONS[l.platform];
                  return (
                    <a
                      key={l.platform}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_LABELS[l.platform]}
                      className="glass flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-accent hover:shadow-md hover:shadow-accent/20"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              {CLOSING_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group glass relative rounded-full px-4 py-2 text-sm font-medium text-fg transition-all duration-300 hover:-translate-y-0.5 hover:text-accent hover:shadow-lg hover:shadow-accent/20"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-accent/30 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"
                  />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fg-subtle">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p className="font-mono text-xs text-fg-subtle">Designed &amp; built with care.</p>
        </div>
      </div>
    </footer>
  );
}
