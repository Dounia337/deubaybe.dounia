import Link from "next/link";

export function SiteFooter({ siteName }: { siteName: string }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-base text-fg">{siteName}</p>
            <p className="mt-1 text-sm text-fg-subtle">
              Building thoughtfully, leading intentionally.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/cv"
              className="group glass relative rounded-full px-4 py-2 text-sm font-medium text-fg transition-all duration-300 hover:-translate-y-0.5 hover:text-accent hover:shadow-lg hover:shadow-accent/20"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-accent/30 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"
              />
              CV
            </Link>
            <Link
              href="/contact"
              className="group glass relative rounded-full px-4 py-2 text-sm font-medium text-fg transition-all duration-300 hover:-translate-y-0.5 hover:text-accent hover:shadow-lg hover:shadow-accent/20"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-accent/30 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"
              />
              Contact
            </Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-fg-subtle">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
