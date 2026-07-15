"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { Card } from "@/components/ui/primitives";
import { formatDate } from "@/lib/format";
import type { Message } from "@/db/repo";

export function MessageRow({ message }: { message: Message }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleRead() {
    setBusy(true);
    await fetch(`/api/messages/${message.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: !message.is_read }),
    });
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this message?")) return;
    setBusy(true);
    await fetch(`/api/messages/${message.id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <Card className={!message.is_read ? "border-accent/30" : undefined}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {!message.is_read && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
            <p className="font-medium text-fg">{message.name}</p>
            <span className="text-sm text-fg-subtle">{message.email}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{message.message}</p>
          <p className="mt-2 font-mono text-xs text-fg-subtle">{formatDate(message.created_at)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={toggleRead}
            disabled={busy}
            title={message.is_read ? "Mark unread" : "Mark read"}
            className="rounded-md p-2 text-fg-muted hover:bg-bg-sunken hover:text-fg disabled:opacity-50"
          >
            {message.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
          </button>
          <button
            onClick={remove}
            disabled={busy}
            title="Delete"
            className="rounded-md p-2 text-fg-muted hover:bg-bg-sunken hover:text-danger disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
