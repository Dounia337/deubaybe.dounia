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
import { HELLO_DURATION, I_DURATION, AM_DURATION } from "@/lib/hero-timing";
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

// How long each slot (identity details, or a featured item) holds before handing off to the next.
const SLOT_DURATION = 7000;

// The photo + the slot beneath it reveal together, once, as a simple fade/slide — no blur on
// this wrapper, since it contains the portrait and the photo must never be blurred.
const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const greeting: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, filter: "blur(8px)", transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
};

// Shared transition for whatever currently occupies the slot beneath the photo — the identity
// details (name/buttons/socials) and each featured item all use this same slide, so handing off
// between them feels like one continuous motion language rather than different UI moments.
const slot: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -18, filter: "blur(8px)", transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
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
  // a flashing "Hello, / I am" that immediately disappears helps no one. Otherwise the greeting
  // builds word by word — "Hello," then "I" then "am" joins it a beat later — before the photo
  // and identity land.
  const [introPhase, setIntroPhase] = useState<"hello" | "i" | "am" | "identity">(
    prefersReducedMotion ? "identity" : "hello"
  );

  useEffect(() => {
    if (introPhase !== "hello") return;
    const t = setTimeout(() => setIntroPhase("i"), HELLO_DURATION);
    return () => clearTimeout(t);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "i") return;
    const t = setTimeout(() => setIntroPhase("am"), I_DURATION);
    return () => clearTimeout(t);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "am") return;
    const t = setTimeout(() => setIntroPhase("identity"), AM_DURATION);
    return () => clearTimeout(t);
  }, [introPhase]);

  // One shared slot beneath the (always-visible-once-revealed) photo: slot 0 is the identity
  // details (name/headline/buttons/socials), slots 1..N are the featured items. They take turns
  // in the exact same space — the photo itself never belongs to this rotation.
  const totalSlots = 1 + featured.length;
  const [slotIndex, setSlotIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || introPhase !== "identity" || totalSlots <= 1 || paused) return;
    const t = setTimeout(() => setSlotIndex((i) => (i + 1) % totalSlots), SLOT_DURATION);
    return () => clearTimeout(t);
  }, [introPhase, slotIndex, totalSlots, paused, prefersReducedMotion]);

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

  const activeFeatured = slotIndex > 0 ? featured[slotIndex - 1] : undefined;

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
        <div className="relative">
          {/* Photo + slot reveal together, once, as the "first full identity moment" — always
              present in the markup (SEO/no-JS safe), only their opacity is gated on the intro. */}
          <motion.div
            initial={false}
            animate={introPhase === "identity" ? "show" : "hidden"}
            variants={reveal}
            className="flex flex-col items-center"
          >
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

            {/* The rotating slot — identity details and featured items take turns here, in the
                exact same space, so featured content replaces the name/buttons/socials rather
                than appearing as a separate section. */}
            <div className="relative mt-7 w-full">
              <AnimatePresence mode="wait" initial={false}>
                {slotIndex === 0 ? (
                  <motion.div
                    key="identity-details"
                    variants={slot}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="flex flex-col items-center"
                  >
                    <p className="flex min-h-[1.5em] items-center justify-center gap-0.5 text-base font-medium text-accent">
                      {typed}
                      <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent align-middle" />
                    </p>

                    <h1 className="text-shine mt-4 font-display text-5xl font-semibold tracking-[-0.015em] drop-shadow-[0_0_36px_var(--accent-glow)] sm:text-6xl lg:text-7xl">
                      {name}
                    </h1>

                    <p className="mt-6 max-w-xl text-xl leading-relaxed text-fg-muted">{headline}</p>

                    <div className="mt-9 flex flex-wrap justify-center gap-3">
                      <Button href="/projects" variant="primary">
                        View my work <ArrowUpRight className="h-4 w-4" />
                      </Button>
                      <Button href="/cv" variant="secondary">
                        <Download className="h-4 w-4" /> Download CV
                      </Button>
                    </div>

                    {socialLinks.length > 0 && (
                      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
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
                      </div>
                    )}
                  </motion.div>
                ) : (
                  activeFeatured && (
                    <motion.div key={`featured-${slotIndex}`} variants={slot} initial="hidden" animate="show" exit="exit">
                      <Eyebrow>{activeFeatured.label}</Eyebrow>
                      <Link
                        href={activeFeatured.href}
                        className="glass mx-auto mt-4 flex w-full max-w-xl flex-col overflow-hidden rounded-3xl text-left shadow-lg shadow-black/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.12] sm:flex-row sm:items-stretch"
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
                  )
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Greeting overlay — "Hello," then "I" then "am" joins it a beat later — centered
              over the whole photo+slot box (which already occupies its final size, just
              invisible) so nothing shifts once it hands off, and no picture or text beneath
              ever peeks through. The "hello"->"i" swap is a full AnimatePresence crossfade;
              "i"->"am" keeps the same block on screen and just adds the second word beside it,
              so "I" never re-animates when "am" joins. */}
          <AnimatePresence>
            {introPhase !== "identity" && (
              <motion.div
                key={introPhase === "hello" ? "hello" : "i-am"}
                variants={greeting}
                initial="hidden"
                animate="show"
                exit="exit"
                className="absolute inset-0 flex items-center justify-center"
              >
                <p className="font-display text-4xl font-medium text-fg-muted sm:text-5xl">
                  {introPhase === "hello" ? (
                    "Hello,"
                  ) : (
                    <>
                      I
                      {introPhase === "am" && (
                        <motion.span
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="ml-2 inline-block"
                        >
                          am
                        </motion.span>
                      )}
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
