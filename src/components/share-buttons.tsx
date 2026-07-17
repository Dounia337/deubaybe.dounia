"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { cx } from "@/lib/format";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  // Feature-detected after mount, not during render: Node's SSR environment exposes its own
  // `navigator` global (without `.share`) that can disagree with the browser's, which would
  // otherwise make the server-rendered markup differ from the client and fail hydration.
  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount-only feature detection (matches site-header.tsx's `mounted` flag)
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  async function handleShare() {
    try {
      await navigator.share({ title, url: window.location.href });
    } catch {
      // User cancelled the share sheet — no error state needed.
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex items-center gap-2">
      {canShare && (
        <button
          type="button"
          onClick={handleShare}
          className="glass flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-fg-muted transition-colors hover:text-accent"
        >
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className={cx(
          "glass flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
          copied ? "text-accent" : "text-fg-muted hover:text-accent"
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
