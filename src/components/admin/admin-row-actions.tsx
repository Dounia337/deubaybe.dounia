"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import Link from "next/link";

export function AdminRowActions({
  editHref,
  apiPath,
  published,
  onTogglePublished,
}: {
  editHref: string;
  apiPath: string; // e.g. /api/projects/12
  published?: boolean;
  onTogglePublished?: (next: boolean) => Promise<void> | void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this permanently? This can't be undone.")) return;
    setBusy(true);
    const res = await fetch(apiPath, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("Couldn't delete — try again.");
  }

  async function handleToggle() {
    if (!onTogglePublished) return;
    setBusy(true);
    await onTogglePublished(!published);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      {onTogglePublished && (
        <button
          onClick={handleToggle}
          disabled={busy}
          title={published ? "Unpublish" : "Publish"}
          className="rounded-md p-2 text-fg-muted hover:bg-bg-elevated hover:text-fg disabled:opacity-50"
        >
          {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      )}
      <Link
        href={editHref}
        title="Edit"
        className="rounded-md p-2 text-fg-muted hover:bg-bg-elevated hover:text-fg"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={busy}
        title="Delete"
        className="rounded-md p-2 text-fg-muted hover:bg-bg-elevated hover:text-danger disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
