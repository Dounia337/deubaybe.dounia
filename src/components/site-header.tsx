"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { cx } from "@/lib/format";
import { Avatar } from "@/components/ui/primitives";
import { HERO_INTRO_MS } from "@/lib/hero-timing";
import { NAV_LINKS } from "@/lib/nav-links";

const AUTO_PEEK_DELAY = 1100;
// On the homepage, the hero plays its own "Hello, / I am / [identity]" entrance — the nav
// shouldn't detach and compete for attention until that has fully landed.
const HOME_AUTO_PEEK_DELAY = HERO_INTRO_MS + 300;
const HINT_DURATION = 1500;
const CLICK_OPEN_DURATION = 3200;

export function SiteHeader({ siteName, photoUrl }: { siteName: string; photoUrl?: string | null }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const expandedRef = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusInside = useRef(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount flag, standard SSR-safe pattern
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose(delay: number) {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      if (!focusInside.current) setExpanded(false);
    }, delay);
  }

  // Quietly suggest the interaction once, rather than fully expanding it: a small directional
  // cue drifts out from the avatar and settles back — "there's something here," not "look at
  // me." Delayed on the homepage until the hero's own entrance has finished, so the two don't
  // compete. Real expansion still only ever happens from an actual click or keyboard focus.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const delay = pathname === "/" ? HOME_AUTO_PEEK_DELAY : AUTO_PEEK_DELAY;
    const openTimer = setTimeout(() => {
      setShowHint(true);
      hintTimer.current = setTimeout(() => setShowHint(false), HINT_DURATION);
    }, delay);
    return () => clearTimeout(openTimer);
    // Intentionally mount-only — re-firing this on every client-side navigation would mean
    // "teach the interaction once" becomes "re-teach it on every page visit".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  // Collapse immediately once the user starts scrolling.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
      if (expandedRef.current) {
        clearCloseTimer();
        setExpanded(false);
      }
      setShowHint(false);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => () => clearCloseTimer(), []);
  useEffect(() => () => {
    if (hintTimer.current) clearTimeout(hintTimer.current);
  }, []);

  function handleToggle() {
    clearCloseTimer();
    setShowHint(false);
    setExpanded((v) => {
      const next = !v;
      if (next) scheduleClose(CLICK_OPEN_DURATION);
      return next;
    });
  }

  // Keep it open while a keyboard user is tabbing through the nav links.
  function handleFocusCapture() {
    focusInside.current = true;
    clearCloseTimer();
    setShowHint(false);
  }
  function handleBlurCapture(e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      focusInside.current = false;
      if (expandedRef.current) scheduleClose(CLICK_OPEN_DURATION);
    }
  }

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto max-w-6xl">
        <motion.div
          layout
          onFocusCapture={handleFocusCapture}
          onBlurCapture={handleBlurCapture}
          transition={{ layout: { type: "spring", stiffness: 340, damping: 30 } }}
          className={cx(
            "relative inline-flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-1 p-1.5 shadow-lg shadow-black/[0.06] transition-[border-radius,background-color,border-color,box-shadow] duration-300",
            expanded ? "rounded-[28px]" : "rounded-full",
            scrolled || expanded ? "glass-strong" : "glass"
          )}
        >
          {/* Ambient pulse: a quiet "you can click me" cue while collapsed */}
          {!expanded && !prefersReducedMotion && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -inset-1.5 rounded-full bg-accent/40 blur-md"
              animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.05, 0.35] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Directional hint: a small glass bubble drifts out from the avatar and fades —
              a quiet "there's something here," not a full reveal of the nav labels. */}
          <AnimatePresence>
            {showHint && !expanded && (
              <motion.span
                aria-hidden
                initial={{ opacity: 0, x: -2 }}
                animate={{ opacity: [0, 1, 1, 0], x: [-2, 5, 7, 10] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, times: [0, 0.3, 0.75, 1], ease: "easeInOut" }}
                className="glass pointer-events-none absolute left-full top-1/2 z-10 ml-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-fg-muted"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </motion.span>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={expanded}
            aria-label={expanded ? "Close navigation" : "Open navigation"}
            className="shrink-0 cursor-pointer rounded-full"
          >
            <Avatar
              src={photoUrl}
              alt={siteName}
              size={36}
              className="transition-transform duration-300 hover:scale-110"
            />
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.08, duration: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="flex flex-wrap items-center gap-1 pr-1.5"
              >
                <nav className="flex flex-wrap items-center gap-1">
                  {NAV_LINKS.map((link) => {
                    const active =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname === link.href || pathname.startsWith(link.href + "/");
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cx(
                          "relative whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors",
                          active ? "font-medium text-fg" : "text-fg-muted hover:bg-bg-sunken/50 hover:text-fg"
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-full bg-bg-sunken/80"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="relative">{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle color theme"
                    className="relative shrink-0 cursor-pointer overflow-hidden rounded-full p-2 text-fg-muted transition-colors hover:bg-bg-sunken/60 hover:text-accent"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {theme === "dark" ? (
                        <motion.span
                          key="sun"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="block"
                        >
                          <Sun className="h-4 w-4" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="moon"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="block"
                        >
                          <Moon className="h-4 w-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
}
