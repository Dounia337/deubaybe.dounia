"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { Chip } from "@/components/ui/primitives";
import { ImmersiveImage } from "@/components/immersive-image";
import { cx } from "@/lib/format";

export function ExperienceCard({
  title,
  type,
  date,
  description,
  keyTakeaway,
  imageUrl,
}: {
  title: string;
  type: string;
  date: string;
  description: string;
  keyTakeaway?: string | null;
  imageUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass overflow-hidden rounded-2xl shadow-sm shadow-black/[0.03] transition-shadow duration-300 hover:shadow-lg hover:shadow-black/[0.06]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer flex-col text-left"
      >
        {imageUrl ? (
          <ImmersiveImage src={imageUrl} alt={title} heightClass="h-56 sm:h-64 md:h-72" />
        ) : (
          <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-accent-tertiary/15 via-transparent to-accent/15 sm:h-64 md:h-72">
            <Sparkles className="h-10 w-10 text-accent-tertiary" />
          </div>
        )}

        <div className="flex flex-col gap-5 p-6 transition-colors duration-300 hover:bg-bg-sunken/40 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-xl font-medium text-fg">{title}</h3>
              <span className="text-xs text-fg-subtle">{date}</span>
            </div>
            <Chip>{type}</Chip>
            <p className={cx("mt-3 text-base leading-relaxed text-fg-muted", !open && "line-clamp-2")}>
              {description}
            </p>
          </div>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="hidden shrink-0 self-start text-fg-subtle sm:block"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && keyTakeaway && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="border-t border-border px-6 pb-6 pt-4 text-base leading-relaxed text-fg">
              <span className="font-mono text-xs uppercase tracking-wider text-accent">Key takeaway — </span>
              {keyTakeaway}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
