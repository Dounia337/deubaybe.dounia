"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { Chip } from "@/components/ui/primitives";
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
        className="flex w-full flex-col gap-5 p-6 text-left sm:flex-row sm:items-center"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-bg-sunken sm:h-28 sm:w-28">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill sizes="112px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-tertiary/15 via-transparent to-accent/15">
              <Sparkles className="h-7 w-7 text-accent-tertiary" />
            </div>
          )}
        </div>
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
