"use client";

import { useEffect, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, Sparkles } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa6";
import { Avatar, Button } from "@/components/ui/primitives";
import { cx } from "@/lib/format";
import type { FeaturedItem, SocialPlatform } from "@/db/repo";

const SOCIAL_ICONS: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
};

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
};

const ROLES = [
  "Computer Science student",
  "Blue Team learner",
  "Builder for African contexts",
  "Youth development lead",
];

// Timing for the one-time entrance: "Hello," -> "I am" -> full identity reveal.
const HELLO_DURATION = 1300;
const IAM_DURATION = 1100;

// Timing for the recurring alternation between identity and a featured highlight.
const IDENTITY_DURATION = 7000;
const FEATURED_DURATION = 6200;

const container: Variants = {
  hidden: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)", transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Avatar visibility never touches `filter` — the portrait must stay sharp at all times;
// only opacity carries the hide/show transition, same principle as the entrance fix above.
const avatarVisibility: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
  show: { opacity: 1, transition: { duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] } },
};

const greeting: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, filter: "blur(8px)", transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
};

const slide: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, filter: "blur(8px)", transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
};

export function ProfileHero({
  name,
  headline,
  photoUrl,
  socialLinks = [],
  featured = [],
}: {
  name: string;
  headline: string;
  photoUrl?: string | null;
  socialLinks?: { platform: SocialPlatform; url: string }[];
  featured?: FeaturedItem[];
}) {
  const prefersReducedMotion = useReducedMotion();

  // Entrance choreography: skip straight to the final state for reduced-motion visitors —
  // a flashing "Hello, / I am" that immediately disappears helps no one.
  const [introPhase, setIntroPhase] = useState<"hello" | "iam" | "identity">(
    prefersReducedMotion ? "identity" : "hello"
  );

  useEffect(() => {
    if (introPhase !== "hello") return;
    const t = setTimeout(() => setIntroPhase("iam"), HELLO_DURATION);
    return () => clearTimeout(t);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "iam") return;
    const t = setTimeout(() => setIntroPhase("identity"), IAM_DURATION);
    return () => clearTimeout(t);
  }, [introPhase]);

  // Once settled on the identity, gently alternate with featured highlights (if any exist).
  // Paused on hover/focus so nobody mid-read gets the card pulled out from under them, and
  // switched off entirely for reduced motion — the same items are always reachable below.
  const [showingFeatured, setShowingFeatured] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || introPhase !== "identity" || featured.length === 0 || paused) return;
    const delay = showingFeatured ? FEATURED_DURATION : IDENTITY_DURATION;
    const t = setTimeout(() => {
      if (showingFeatured) setFeaturedIndex((i) => (i + 1) % featured.length);
      setShowingFeatured((v) => !v);
    }, delay);
    return () => clearTimeout(t);
  }, [introPhase, showingFeatured, featured.length, paused, prefersReducedMotion]);

  const [roleIndex, setRoleIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = ROLES[roleIndex];
    const speed = deleting ? 28 : 45;
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (typed.length < full.length) {
          setTyped(full.slice(0, typed.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1400);
        }
      } else {
        if (typed.length > 0) {
          setTyped(typed.slice(0, -1));
        } else {
          setDeleting(false);
          setRoleIndex((i) => (i + 1) % ROLES.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [typed, deleting, roleIndex]);

  // Ambient blobs drift toward the cursor for a subtle, living backdrop.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 50, damping: 16 });
  const springY = useSpring(rawY, { stiffness: 50, damping: 16 });
  const blob1X = useTransform(springX, [-1, 1], [-30, 30]);
  const blob1Y = useTransform(springY, [-1, 1], [-30, 30]);
  const blob2X = useTransform(springX, [-1, 1], [24, -24]);
  const blob2Y = useTransform(springY, [-1, 1], [24, -24]);

  function handlePointerMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  const activeFeatured = featured[featuredIndex];
  const identityActive = introPhase === "identity" && !showingFeatured;

  return (
    <div
      className="relative overflow-hidden"
      onMouseMove={handlePointerMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
        setPaused(false);
      }}
    >
      <motion.div
        style={{ x: blob1X, y: blob1Y }}
        className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-accent-tertiary/15 blur-3xl"
      />
      <motion.div
        style={{ x: blob2X, y: blob2Y }}
        className="pointer-events-none absolute -bottom-24 left-[-5%] h-72 w-72 rounded-full bg-accent-secondary/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-32">
        {/* Identity — always present in the markup (SEO/no-JS safe); the intro sequence only
            ever controls its opacity/blur, never whether the name/headline exist in the DOM. */}
        <motion.div
          initial={false}
          animate={identityActive ? "show" : "hidden"}
          variants={container}
          className={cx("relative flex flex-col items-center", !identityActive && "pointer-events-none")}
        >
          <motion.div variants={avatarVisibility} className="group relative inline-block">
            <div className="glass absolute -inset-5 rounded-full transition-transform duration-300 ease-out group-hover:scale-105" />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -inset-3 rounded-full bg-accent/25 blur-xl"
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.15, 0.4] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <Avatar
              src={photoUrl}
              alt={name}
              size="clamp(148px, 30vw, 256px)"
              className="relative shadow-2xl shadow-black/10"
            />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-7 flex min-h-[1.5em] items-center justify-center gap-0.5 text-base font-medium text-accent"
          >
            {typed}
            <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent align-middle" />
          </motion.p>

          <motion.div variants={item} className="mt-4">
            <h1 className="text-shine font-display text-5xl font-semibold tracking-[-0.015em] drop-shadow-[0_0_36px_var(--accent-glow)] sm:text-6xl lg:text-7xl">
              {name}
            </h1>
          </motion.div>

          <motion.p variants={item} className="mt-6 max-w-xl text-xl leading-relaxed text-fg-muted">
            {headline}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/projects" variant="primary">
              View my work <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button href="/cv" variant="secondary">
              <Download className="h-4 w-4" /> Download CV
            </Button>
          </motion.div>

          {socialLinks.length > 0 && (
            <motion.div variants={item} className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {socialLinks.map((l) => {
                const Icon = SOCIAL_ICONS[l.platform];
                return (
                  <a
                    key={l.platform}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[l.platform]}
                    className="glass flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-accent hover:shadow-md hover:shadow-accent/20"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Greeting overlay — purely decorative intro copy, absolutely centered over the
            identity's box so nothing shifts once it hands off. */}
        <AnimatePresence>
          {(introPhase === "hello" || introPhase === "iam") && (
            <motion.div
              key={introPhase}
              variants={greeting}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center"
            >
              <p className="font-display text-4xl font-medium text-fg-muted sm:text-5xl">
                {introPhase === "hello" ? "Hello," : "I am"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured highlight overlay — the same items already live in the sections below,
            so this is a supplementary spotlight, not the visitor's only way to reach them. */}
        <AnimatePresence>
          {showingFeatured && activeFeatured && (
            <motion.div
              key={`featured-${featuredIndex}`}
              variants={slide}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center px-2"
            >
              <Link
                href={activeFeatured.href}
                className="glass-strong mx-auto flex w-full max-w-xl flex-col overflow-hidden rounded-3xl text-left shadow-2xl shadow-black/10 transition-transform duration-300 hover:-translate-y-1 sm:flex-row sm:items-stretch"
              >
                <div className="relative h-44 w-full shrink-0 sm:h-auto sm:w-48">
                  {activeFeatured.image_url ? (
                    <Image
                      src={activeFeatured.image_url}
                      alt={activeFeatured.title}
                      fill
                      sizes="192px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/25 via-bg-sunken to-accent-secondary/25">
                      <Sparkles className="h-10 w-10 text-accent/50" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center gap-2 p-6">
                  <span className="text-xs font-medium uppercase tracking-wide text-accent">
                    {activeFeatured.label}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-fg">{activeFeatured.title}</h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-fg-muted">{activeFeatured.description}</p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    View more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
