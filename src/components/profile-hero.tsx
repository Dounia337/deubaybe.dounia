"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa6";
import { Avatar, Button } from "@/components/ui/primitives";
import { Mirror } from "@/components/ui/motion";
import type { SocialPlatform } from "@/db/repo";

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

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function ProfileHero({
  name,
  headline,
  photoUrl,
  socialLinks = [],
}: {
  name: string;
  headline: string;
  photoUrl?: string | null;
  socialLinks?: { platform: SocialPlatform; url: string }[];
}) {
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

  return (
    <div
      className="relative overflow-hidden"
      onMouseMove={handlePointerMove}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
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

      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-32"
      >
        {/* Portrait stays sharp and static at all times — every bit of blur/motion lives in the
            surrounding glass + glow layers behind it, never on the photo itself. */}
        <div className="group relative inline-block">
          <div className="glass absolute -inset-5 rounded-full transition-transform duration-300 ease-out group-hover:scale-105" />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-3 rounded-full bg-accent/25 blur-xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.15, 0.4] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <Avatar
              src={photoUrl}
              alt={name}
              size="clamp(148px, 30vw, 256px)"
              className="relative shadow-2xl shadow-black/10"
            />
          </motion.div>
        </div>

        <motion.p
          variants={item}
          className="mt-7 flex min-h-[1.5em] items-center justify-center gap-0.5 text-base font-medium text-accent"
        >
          {typed}
          <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent align-middle" />
        </motion.p>

        <motion.div variants={item} className="mt-4">
          <Mirror>
            <h1 className="text-gradient font-display text-5xl font-semibold tracking-[-0.015em] drop-shadow-[0_0_36px_var(--accent-glow)] sm:text-6xl lg:text-7xl">
              {name}
            </h1>
          </Mirror>
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
    </div>
  );
}
