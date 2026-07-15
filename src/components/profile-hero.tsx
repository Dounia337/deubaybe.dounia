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
import { Avatar, Button, Eyebrow } from "@/components/ui/primitives";
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

// How long each featured item holds before crossfading to the next one.
const FEATURED_DURATION = 6500;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const greeting: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, filter: "blur(8px)", transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
};

const featuredSlide: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, filter: "blur(6px)", transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
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

  // The identity (photo, name, headline) never leaves once it arrives — featured content is a
  // second, independent layer beneath it that cycles on its own, paused on hover/focus so
  // nobody mid-read gets the card swapped out from under them.
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasFeatured = featured.length > 0;

  useEffect(() => {
    if (prefersReducedMotion || introPhase !== "identity" || featured.length < 2 || paused) return;
    const t = setTimeout(() => setFeaturedIndex((i) => (i + 1) % featured.length), FEATURED_DURATION);
    return () => clearTimeout(t);
  }, [introPhase, featuredIndex, featured.length, paused, prefersReducedMotion]);

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
        {/* Primary layer — the identity. Always present in the markup (SEO/no-JS safe); the
            intro sequence only ever controls its opacity/blur on the way in, and once it has
            arrived it stays — featured content never displaces it. */}
        <motion.div
          initial={false}
          animate={introPhase === "identity" ? "show" : "hidden"}
          variants={container}
          className="relative flex flex-col items-center"
        >
          <div className="relative flex w-full flex-col items-center">
            <div className="group relative inline-block">
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
            </div>

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

            {/* Greeting overlay — purely decorative intro copy, absolutely centered over just
                this identity-core box so it never leaks into the featured section's space. */}
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
          </div>

          {/* Secondary layer — featured content, presented alongside the identity above,
              never in place of it. Only this area animates once it's up and cycling. */}
          {hasFeatured && activeFeatured && (
            <motion.div
              variants={item}
              className="mt-12 w-full border-t border-border pt-10 sm:mt-14 sm:pt-12"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`featured-${featuredIndex}`}
                  variants={featuredSlide}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <Eyebrow>{activeFeatured.label}</Eyebrow>
                  <Link
                    href={activeFeatured.href}
                    className="glass mx-auto mt-4 flex w-full max-w-xl flex-col overflow-hidden rounded-3xl text-left shadow-lg shadow-black/[0.06] transition-transform duration-300 hover:-translate-y-1 sm:flex-row sm:items-stretch"
                  >
                    <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-44">
                      {activeFeatured.image_url ? (
                        <Image
                          src={activeFeatured.image_url}
                          alt={activeFeatured.title}
                          fill
                          sizes="176px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/25 via-bg-sunken to-accent-secondary/25">
                          <Sparkles className="h-9 w-9 text-accent/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-1.5 p-5 sm:p-6">
                      <h3 className="font-display text-xl font-semibold text-fg sm:text-2xl">
                        {activeFeatured.title}
                      </h3>
                      <p className="line-clamp-2 text-sm leading-relaxed text-fg-muted">
                        {activeFeatured.description}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                        View more <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
