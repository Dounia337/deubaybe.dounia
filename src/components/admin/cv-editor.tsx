"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { Field, TextInput, TextArea } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button, Card } from "@/components/ui/primitives";

type Profile = {
  full_name: string;
  headline: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  links: { label: string; url: string }[];
  photo_url: string | null;
};
type Education = { id: number; institution: string; degree: string; field: string | null; start_date: string; end_date: string | null; description: string | null };
type WorkExperience = { id: number; organization: string; role: string; start_date: string; end_date: string | null; description: string | null };
type Skill = { id: number; category: string; name: string; level: number };
type Leadership = { id: number; role: string; organization: string; start_date: string; end_date: string | null; description: string | null };

export function CVEditor() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<WorkExperience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [leadership, setLeadership] = useState<Leadership[]>([]);

  async function load() {
    const res = await fetch("/api/cv");
    const json = await res.json();
    setProfile(json.profile);
    setEducation(json.education);
    setExperience(json.experience);
    setSkills(json.skills);
    setLeadership(json.leadership);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount pattern
    load();
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex items-center gap-2 text-sm text-fg-muted">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading CV data…
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-10">
      <ProfileSection profile={profile} setProfile={setProfile} />
      <EducationSection items={education} reload={load} />
      <ExperienceSection items={experience} reload={load} />
      <LeadershipSection items={leadership} reload={load} />
      <SkillsSection items={skills} reload={load} />
    </div>
  );
}

function ProfileSection({
  profile,
  setProfile,
}: {
  profile: Profile;
  setProfile: (p: Profile) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof Profile>(key: K, val: Profile[K]) {
    setProfile({ ...profile, [key]: val });
  }

  async function save() {
    setSaving(true);
    await fetch("/api/cv", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-fg">Profile</h2>
      <div className="mt-4 space-y-4">
        <ImageUploadField
          label="Portrait"
          value={profile.photo_url}
          onChange={(url) => set("photo_url", url)}
          hint="Used in the site header and homepage hero."
        />
        <Field label="Full name">
          <TextInput value={profile.full_name} onChange={(e) => set("full_name", e.target.value)} />
        </Field>
        <Field label="Headline">
          <TextInput value={profile.headline} onChange={(e) => set("headline", e.target.value)} />
        </Field>
        <Field label="Summary">
          <TextArea rows={4} value={profile.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Email">
            <TextInput value={profile.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Phone">
            <TextInput value={profile.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="Location">
            <TextInput value={profile.location} onChange={(e) => set("location", e.target.value)} />
          </Field>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : saved ? "Saved" : "Save profile"}
        </Button>
      </div>
    </section>
  );
}

function EducationSection({ items, reload }: { items: Education[]; reload: () => void }) {
  const [form, setForm] = useState({ institution: "", degree: "", field: "", start_date: "", end_date: "", description: "" });
  const [adding, setAdding] = useState(false);

  async function add() {
    if (!form.institution || !form.degree || !form.start_date) return;
    setAdding(true);
    await fetch("/api/cv/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ institution: "", degree: "", field: "", start_date: "", end_date: "", description: "" });
    setAdding(false);
    reload();
  }

  async function remove(id: number) {
    await fetch(`/api/cv/education/${id}`, { method: "DELETE" });
    reload();
  }

  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-fg">Education</h2>
      <div className="mt-4 space-y-3">
        {items.map((e) => (
          <Card key={e.id} className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-fg">{e.institution}</p>
              <p className="text-sm text-fg-muted">{e.degree}{e.field ? `, ${e.field}` : ""}</p>
              <p className="font-mono text-xs text-fg-subtle">{e.start_date} – {e.end_date || "Present"}</p>
            </div>
            <button onClick={() => remove(e.id)} className="rounded-md p-2 text-fg-muted hover:text-danger">
              <Trash2 className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-3 rounded-lg border border-dashed border-border-strong p-4 sm:grid-cols-2">
        <TextInput placeholder="Institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
        <TextInput placeholder="Degree" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
        <TextInput placeholder="Field of study (optional)" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <TextInput type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <TextInput type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} placeholder="End (blank = present)" />
        </div>
        <TextArea placeholder="Description (optional)" className="sm:col-span-2" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Button type="button" variant="secondary" onClick={add} disabled={adding} className="sm:col-span-2">
          <Plus className="h-4 w-4" /> Add education
        </Button>
      </div>
    </section>
  );
}

function ExperienceSection({ items, reload }: { items: WorkExperience[]; reload: () => void }) {
  const [form, setForm] = useState({ organization: "", role: "", start_date: "", end_date: "", description: "" });
  const [adding, setAdding] = useState(false);

  async function add() {
    if (!form.organization || !form.role || !form.start_date) return;
    setAdding(true);
    await fetch("/api/cv/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ organization: "", role: "", start_date: "", end_date: "", description: "" });
    setAdding(false);
    reload();
  }

  async function remove(id: number) {
    await fetch(`/api/cv/experience/${id}`, { method: "DELETE" });
    reload();
  }

  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-fg">Experience</h2>
      <div className="mt-4 space-y-3">
        {items.map((e) => (
          <Card key={e.id} className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-fg">{e.role} · {e.organization}</p>
              <p className="font-mono text-xs text-fg-subtle">{e.start_date} – {e.end_date || "Present"}</p>
            </div>
            <button onClick={() => remove(e.id)} className="rounded-md p-2 text-fg-muted hover:text-danger">
              <Trash2 className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-3 rounded-lg border border-dashed border-border-strong p-4 sm:grid-cols-2">
        <TextInput placeholder="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
        <TextInput placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <div className="grid grid-cols-2 gap-3 sm:col-span-2">
          <TextInput type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <TextInput type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} placeholder="End (blank = present)" />
        </div>
        <TextArea placeholder="Description (optional)" className="sm:col-span-2" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Button type="button" variant="secondary" onClick={add} disabled={adding} className="sm:col-span-2">
          <Plus className="h-4 w-4" /> Add experience
        </Button>
      </div>
    </section>
  );
}

function LeadershipSection({ items, reload }: { items: Leadership[]; reload: () => void }) {
  const [form, setForm] = useState({ role: "", organization: "", start_date: "", end_date: "", description: "" });
  const [adding, setAdding] = useState(false);

  async function add() {
    if (!form.role || !form.organization || !form.start_date) return;
    setAdding(true);
    await fetch("/api/cv/leadership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ role: "", organization: "", start_date: "", end_date: "", description: "" });
    setAdding(false);
    reload();
  }

  async function remove(id: number) {
    await fetch(`/api/cv/leadership/${id}`, { method: "DELETE" });
    reload();
  }

  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-fg">Leadership</h2>
      <div className="mt-4 space-y-3">
        {items.map((e) => (
          <Card key={e.id} className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-fg">{e.role} · {e.organization}</p>
              <p className="font-mono text-xs text-fg-subtle">{e.start_date} – {e.end_date || "Present"}</p>
            </div>
            <button onClick={() => remove(e.id)} className="rounded-md p-2 text-fg-muted hover:text-danger">
              <Trash2 className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-3 rounded-lg border border-dashed border-border-strong p-4 sm:grid-cols-2">
        <TextInput placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <TextInput placeholder="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
        <div className="grid grid-cols-2 gap-3 sm:col-span-2">
          <TextInput type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <TextInput type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} placeholder="End (blank = present)" />
        </div>
        <TextArea placeholder="Description (optional)" className="sm:col-span-2" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Button type="button" variant="secondary" onClick={add} disabled={adding} className="sm:col-span-2">
          <Plus className="h-4 w-4" /> Add leadership role
        </Button>
      </div>
    </section>
  );
}

function SkillsSection({ items, reload }: { items: Skill[]; reload: () => void }) {
  const [form, setForm] = useState({ category: "", name: "", level: 3 });
  const [adding, setAdding] = useState(false);

  async function add() {
    if (!form.category || !form.name) return;
    setAdding(true);
    await fetch("/api/cv/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ category: "", name: "", level: 3 });
    setAdding(false);
    reload();
  }

  async function remove(id: number) {
    await fetch(`/api/cv/skills/${id}`, { method: "DELETE" });
    reload();
  }

  const byCategory = items.reduce<Record<string, Skill[]>>((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-fg">Skills</h2>
      <div className="mt-4 space-y-4">
        {Object.entries(byCategory).map(([category, skills]) => (
          <div key={category}>
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">{category}</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated px-3 py-1 text-sm text-fg"
                >
                  {s.name}
                  <button onClick={() => remove(s.id)} className="text-fg-subtle hover:text-danger">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 rounded-lg border border-dashed border-border-strong p-4 sm:grid-cols-3">
        <TextInput placeholder="Category e.g. Languages" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <TextInput placeholder="Skill name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Button type="button" variant="secondary" onClick={add} disabled={adding}>
          <Plus className="h-4 w-4" /> Add skill
        </Button>
      </div>
    </section>
  );
}
