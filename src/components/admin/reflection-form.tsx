"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Field, TextInput, TextArea, Toggle, TagInput } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/primitives";

export type ReflectionFormValues = {
  title: string;
  content: string;
  tags: string[];
  image_url: string;
  post_date: string;
  featured: boolean;
  published: boolean;
};

const EMPTY: ReflectionFormValues = {
  title: "",
  content: "",
  tags: [],
  image_url: "",
  post_date: new Date().toISOString().slice(0, 10),
  featured: false,
  published: true,
};

export function ReflectionForm({
  initial,
  reflectionId,
}: {
  initial?: Partial<ReflectionFormValues>;
  reflectionId?: number;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ReflectionFormValues>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ReflectionFormValues>(key: K, val: ReflectionFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = reflectionId ? `/api/reflections/${reflectionId}` : "/api/reflections";
    const res = await fetch(url, {
      method: reflectionId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Couldn't save. Check the fields and try again.");
      return;
    }
    router.push("/admin/reflections");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <Field label="Title">
        <TextInput value={values.title} onChange={(e) => set("title", e.target.value)} required />
      </Field>

      <Field label="Date">
        <TextInput type="date" value={values.post_date} onChange={(e) => set("post_date", e.target.value)} required />
      </Field>

      <Field label="Tags" hint="e.g. Leadership, Tech, Growth">
        <TagInput values={values.tags} onChange={(v) => set("tags", v)} placeholder="Add a tag" />
      </Field>

      <ImageUploadField
        label="Photo"
        value={values.image_url || null}
        onChange={(url) => set("image_url", url || "")}
        hint="Shown on the reflection card and detail page."
      />

      <Field label="Content" hint="Separate paragraphs with a blank line.">
        <TextArea rows={12} value={values.content} onChange={(e) => set("content", e.target.value)} required />
      </Field>

      <div className="flex gap-6">
        <Toggle checked={values.featured} onChange={(v) => set("featured", v)} label="Featured" />
        <Toggle checked={values.published} onChange={(v) => set("published", v)} label="Published" />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save reflection"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/reflections")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
