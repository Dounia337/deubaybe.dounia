"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PublishToggleClient({
  apiPath,
  published,
}: {
  apiPath: string;
  published: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const res = await fetch(apiPath, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-full px-2.5 py-1 font-mono text-xs transition-opacity disabled:opacity-50 ${
        published
          ? "bg-accent/10 text-accent"
          : "bg-bg-sunken text-fg-subtle border border-border-strong"
      }`}
    >
      {published ? "Published" : "Draft"}
    </button>
  );
}
