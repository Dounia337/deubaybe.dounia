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
          <div className="flex gap-5 text-sm text-fg-muted">
            <Link href="/cv" className="hover:text-accent">CV</Link>
            <Link href="/contact" className="hover:text-accent">Contact</Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-fg-subtle">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
