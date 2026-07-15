"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { cx } from "@/lib/format";
import { Reveal, Mirror } from "@/components/ui/motion";
import type { ReactNode } from "react";

export type Crumb = { label: string; href?: string };

/** Persistent wayfinding trail — always visible, independent of the collapsible header nav. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cx("flex flex-wrap items-center gap-1.5 text-sm", className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-fg-subtle" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 text-fg-muted transition-colors hover:text-accent"
              >
                {i === 0 && <HomeIcon className="h-3.5 w-3.5" />}
                {item.label}
              </Link>
            ) : (
              <span className={cx("inline-flex items-center gap-1", isLast ? "font-medium text-fg" : "text-fg-muted")}>
                {i === 0 && <HomeIcon className="h-3.5 w-3.5" />}
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cx("mx-auto max-w-6xl px-4 py-16 sm:px-6", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="glass mb-4 inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium tracking-wide text-accent">
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
}) {
  return (
    <div className="hero-wash">
      <Reveal className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-5 justify-center" />}
        <Eyebrow>{eyebrow}</Eyebrow>
        <Mirror className="mt-2">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Mirror>
        {description && (
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">{description}</p>
        )}
      </Reveal>
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "glass rounded-2xl p-6 shadow-sm shadow-black/[0.03] transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.06]",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Editorial media card: full-bleed photo with title/meta overlaid directly on
 * a bottom scrim, instead of stacked below in a separate text panel. Falls
 * back to a tinted gradient + icon when no image has been set yet, so cards
 * never look broken before an admin uploads a real photo.
 */
export function OverlayCard({
  href,
  src,
  alt,
  icon,
  category,
  title,
  tags,
  date,
  aspect = "aspect-[10/11]",
  className,
}: {
  href?: string;
  src?: string | null;
  alt: string;
  icon: ReactNode;
  category?: string;
  title: string;
  tags?: string[];
  date?: string;
  aspect?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const card = (
    <div
      ref={ref}
      className={cx(
        "group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-2xl shadow-sm shadow-black/[0.05] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20",
        aspect,
        className
      )}
    >
      {src ? (
        <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/30 via-bg-sunken to-accent-secondary/30 transition-transform duration-500 ease-out group-hover:scale-[1.05]">
          <span className="text-accent/50 [&_svg]:h-16 [&_svg]:w-16 sm:[&_svg]:h-20 sm:[&_svg]:w-20">{icon}</span>
        </div>
      )}

      {/* Scrim: guarantees the overlaid text stays legible over any image */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/0" />

      <div className="relative p-5 sm:p-6">
        {category && (
          <span className="glass mb-2.5 inline-flex items-center rounded-full border-white/20 bg-white/15 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
            {category}
          </span>
        )}
        <h3 className="font-display text-xl font-semibold text-white drop-shadow-sm sm:text-2xl">{title}</h3>
        {tags && tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] text-white/85"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {date && <p className="mt-2.5 text-xs text-white/70">{date}</p>}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  ) : (
    card
  );
}

export function Avatar({
  src,
  alt,
  size = 40,
  className,
}: {
  src?: string | null;
  alt: string;
  size?: number | string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "relative shrink-0 overflow-hidden rounded-full bg-bg-sunken ring-1 ring-border-strong",
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={typeof size === "number" ? `${size}px` : "240px"} className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-display text-sm font-medium text-accent">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-bg-sunken/70 px-2.5 py-1 font-mono text-[11px] text-fg-muted">
      {children}
    </span>
  );
}

export function Button({
  children,
  href,
  variant = "primary",
  type,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const styles = cx(
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-150 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100",
    variant === "primary" && "bg-accent text-bg-sunken shadow-sm shadow-accent/20 hover:opacity-90 hover:shadow-md hover:shadow-accent/25",
    variant === "secondary" && "glass text-fg hover:border-accent/40 hover:text-accent",
    variant === "ghost" && "text-fg-muted hover:bg-bg-sunken/60 hover:text-fg",
    variant === "danger" && "border border-danger/40 text-danger hover:bg-danger/10",
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type || "button"} onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border-strong px-6 py-14 text-center">
      <p className="font-display text-lg text-fg">{title}</p>
      {description && <p className="mt-2 text-sm text-fg-muted">{description}</p>}
    </div>
  );
}
