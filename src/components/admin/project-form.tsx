"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Field, TextInput, TextArea, Toggle, TagInput } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/primitives";

export type ProjectFormValues = {
  title: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  tech_stack: string[];
  image_url: string;
  github_url: string;
  demo_url: string;
  featured: boolean;
  published: boolean;
};

const EMPTY: ProjectFormValues = {
  title: "",
  description: "",
  problem: "",
  solution: "",
  impact: "",
  tech_stack: [],
  image_url: "",
  github_url: "",
  demo_url: "",
  featured: false,
  published: true,
};

export function ProjectForm({
  initial,
  projectId,
}: {
  initial?: Partial<ProjectFormValues>;
  projectId?: number;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectFormValues>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ProjectFormValues>(key: K, val: ProjectFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = projectId ? `/api/projects/${projectId}` : "/api/projects";
    const res = await fetch(url, {
      method: projectId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Couldn't save. Check the fields and try again.");
      return;
    }
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <Field label="Title">
        <TextInput value={values.title} onChange={(e) => set("title", e.target.value)} required />
      </Field>

      <Field label="Description" hint="A short summary shown in project cards.">
        <TextArea rows={3} value={values.description} onChange={(e) => set("description", e.target.value)} required />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Problem">
          <TextArea rows={3} value={values.problem} onChange={(e) => set("problem", e.target.value)} />
        </Field>
        <Field label="Solution">
          <TextArea rows={3} value={values.solution} onChange={(e) => set("solution", e.target.value)} />
        </Field>
        <Field label="Impact">
          <TextArea rows={3} value={values.impact} onChange={(e) => set("impact", e.target.value)} />
        </Field>
      </div>

      <Field label="Tech stack" hint="Press Enter or comma to add each technology.">
        <TagInput values={values.tech_stack} onChange={(v) => set("tech_stack", v)} placeholder="e.g. Next.js" />
      </Field>

      <ImageUploadField
        label="Cover photo"
        value={values.image_url || null}
        onChange={(url) => set("image_url", url || "")}
        hint="Shown on the project card and detail page."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="GitHub URL">
          <TextInput value={values.github_url} onChange={(e) => set("github_url", e.target.value)} placeholder="https://github.com/…" />
        </Field>
        <Field label="Demo URL">
          <TextInput value={values.demo_url} onChange={(e) => set("demo_url", e.target.value)} placeholder="https://…" />
        </Field>
      </div>

      <div className="flex gap-6">
        <Toggle checked={values.featured} onChange={(v) => set("featured", v)} label="Featured" />
        <Toggle checked={values.published} onChange={(v) => set("published", v)} label="Published" />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save project"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/projects")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
