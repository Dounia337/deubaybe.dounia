"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { Avatar, Button } from "@/components/ui/primitives";
import { Mirror } from "@/components/ui/motion";

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
}: {
  name: string;
  headline: string;
  photoUrl?: string | null;
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
        <motion.div
          variants={item}
          animate={{ y: [0, -10, 0] }}
          transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        >
          <Avatar
            src={photoUrl}
            alt={name}
            size="clamp(148px, 30vw, 256px)"
            className="shadow-2xl shadow-black/10 transition-transform duration-300 hover:scale-105"
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
          <Mirror>
            <h1 className="font-display text-5xl font-semibold tracking-tight text-fg sm:text-6xl lg:text-7xl">
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
      </motion.div>
    </div>
  );
}
