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
    <span className="glass mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide text-accent">
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
          <h1 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {title}
          </h1>
        </Mirror>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-fg-muted">{description}</p>
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
 * Top-of-card photo slot. Falls back to a soft tinted tile with a
 * centered icon when no image has been set yet (e.g. before an admin
 * uploads one), so cards never look broken.
 */
export function CardMedia({
  src,
  alt,
  icon,
  aspect = "aspect-[4/3]",
}: {
  src?: string | null;
  alt: string;
  icon: ReactNode;
  aspect?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div ref={ref} className={cx("relative w-full overflow-hidden bg-bg-sunken", aspect)}>
      {src ? (
        <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 400px, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        </motion.div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/15 via-transparent to-accent-secondary/15 transition-colors duration-300 group-hover:from-accent/25 group-hover:to-accent-secondary/25">
          <span className="text-accent transition-transform duration-300 group-hover:scale-110 [&_svg]:h-8 [&_svg]:w-8">
            {icon}
          </span>
        </div>
      )}
    </div>
  );
}

/** A Card with a full-bleed photo (or icon placeholder) above the padded content. */
export function MediaCard({
  media,
  children,
  className,
}: {
  media: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "glass group flex flex-col overflow-hidden rounded-2xl shadow-sm shadow-black/[0.03] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.08]",
        className
      )}
    >
      {media}
      <div className="flex flex-1 flex-col p-6">{children}</div>
    </div>
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
  size?: number;
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
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
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
