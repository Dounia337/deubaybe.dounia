"use client";

import { useEffect } from "react";

const EXTRA_SPACING = 16;
const HIGHLIGHT_MS = 1800;

/** Renders nothing — on mount, smooth-scrolls to the element matching the URL hash (if any),
 * offset below the sticky header, then briefly highlights it so the visitor can confirm it's
 * the item they clicked. Lets a plain #anchor link do the rest; no query params needed. */
export function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;

    const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - EXTRA_SPACING;
    window.scrollTo({ top, behavior: "smooth" });

    target.classList.add("target-highlight");
    const timer = setTimeout(() => target.classList.remove("target-highlight"), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
