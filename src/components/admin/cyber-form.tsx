"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Field, TextInput, TextArea, Toggle, TagInput } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/primitives";

export type CyberFormValues = {
  title: string;
  description: string;
  category: string;
  tools_used: string[];
  logs_analysis: string;
  what_i_learned: string;
  image_url: string;
  published: boolean;
};

const EMPTY: CyberFormValues = {
  title: "",
  description: "",
  category: "Blue Team",
  tools_used: [],
  logs_analysis: "",
  what_i_learned: "",
  image_url: "",
  published: true,
};

const CATEGORIES = ["Blue Team", "Log Analysis", "Incident Response", "Networking", "Hardening", "Red Team"];

export function CyberForm({ initial, entryId }: { initial?: Partial<CyberFormValues>; entryId?: number }) {
  const router = useRouter();
  const [values, setValues] = useState<CyberFormValues>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof CyberFormValues>(key: K, val: CyberFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = entryId ? `/api/cyber/${entryId}` : "/api/cyber";
    const res = await fetch(url, {
      method: entryId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Couldn't save. Check the fields and try again.");
      return;
    }
    router.push("/admin/cyber");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <Field label="Title">
        <TextInput value={values.title} onChange={(e) => set("title", e.target.value)} required />
      </Field>

      <Field label="Category">
        <select
          value={values.category}
          onChange={(e) => set("category", e.target.value)}
          className="w-full rounded-md border border-border-strong bg-bg-elevated px-3.5 py-2.5 text-sm text-fg outline-none focus:border-accent"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description">
        <TextArea rows={3} value={values.description} onChange={(e) => set("description", e.target.value)} required />
      </Field>

      <Field label="Tools used" hint="Press Enter or comma to add each tool.">
        <TagInput values={values.tools_used} onChange={(v) => set("tools_used", v)} placeholder="e.g. Splunk" />
      </Field>

      <Field label="Log analysis" hint="Paste relevant log excerpts or findings.">
        <TextArea
          rows={6}
          value={values.logs_analysis}
          onChange={(e) => set("logs_analysis", e.target.value)}
          className="font-mono"
        />
      </Field>

      <Field label="What I learned">
        <TextArea rows={3} value={values.what_i_learned} onChange={(e) => set("what_i_learned", e.target.value)} />
      </Field>

      <ImageUploadField
        label="Photo"
        value={values.image_url || null}
        onChange={(url) => set("image_url", url || "")}
        hint="Shown on the cyber lab card and detail page."
      />

      <Toggle checked={values.published} onChange={(v) => set("published", v)} label="Published" />

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save entry"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/cyber")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
