"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Field, TextInput, TextArea, Toggle } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/primitives";

export type ExperienceFormValues = {
  title: string;
  type: string;
  event_date: string;
  description: string;
  key_takeaway: string;
  image_url: string;
  featured: boolean;
  published: boolean;
};

const EMPTY: ExperienceFormValues = {
  title: "",
  type: "Training",
  event_date: new Date().toISOString().slice(0, 10),
  description: "",
  key_takeaway: "",
  image_url: "",
  featured: false,
  published: true,
};

const TYPES = ["Training", "Conference", "Leadership", "Convening", "Workshop"];

export function ExperienceForm({
  initial,
  experienceId,
}: {
  initial?: Partial<ExperienceFormValues>;
  experienceId?: number;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ExperienceFormValues>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ExperienceFormValues>(key: K, val: ExperienceFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = experienceId ? `/api/experiences/${experienceId}` : "/api/experiences";
    const res = await fetch(url, {
      method: experienceId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Couldn't save. Check the fields and try again.");
      return;
    }
    router.push("/admin/experiences");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <Field label="Title">
        <TextInput value={values.title} onChange={(e) => set("title", e.target.value)} required />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Type">
          <select
            value={values.type}
            onChange={(e) => set("type", e.target.value)}
            className="w-full rounded-md border border-border-strong bg-bg-elevated px-3.5 py-2.5 text-sm text-fg outline-none focus:border-accent"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Date">
          <TextInput
            type="date"
            value={values.event_date}
            onChange={(e) => set("event_date", e.target.value)}
            required
          />
        </Field>
      </div>

      <Field label="Description">
        <TextArea rows={3} value={values.description} onChange={(e) => set("description", e.target.value)} required />
      </Field>

      <Field label="Key takeaway">
        <TextArea rows={2} value={values.key_takeaway} onChange={(e) => set("key_takeaway", e.target.value)} />
      </Field>

      <ImageUploadField
        label="Photo"
        value={values.image_url || null}
        onChange={(url) => set("image_url", url || "")}
      />

      <div className="flex gap-6">
        <Toggle checked={values.featured} onChange={(v) => set("featured", v)} label="Featured" />
        <Toggle checked={values.published} onChange={(v) => set("published", v)} label="Published" />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save experience"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/experiences")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
