"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/primitives";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      message: String(data.get("message") || ""),
      website: String(data.get("website") || ""), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setError("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass flex items-start gap-3 rounded-2xl p-6"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div>
          <p className="font-medium text-fg">Message sent</p>
          <p className="mt-1 text-sm text-fg-muted">Thanks for reaching out — I&apos;ll reply soon.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field — hidden from real visitors, catches simple bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-fg">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={200}
          className="glass w-full rounded-xl px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-accent/40"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-fg">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="glass w-full rounded-xl px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-accent/40"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-fg">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          className="glass w-full resize-none rounded-xl px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-accent/40"
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" disabled={status === "loading"}>
        <Send className="h-4 w-4" /> {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
