import { sql } from "./index";

// ---------- Types ----------

export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  problem: string | null;
  solution: string | null;
  impact: string | null;
  tech_stack: string; // JSON array
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  featured: number;
  published: number;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type CyberEntry = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  tools_used: string; // JSON array
  logs_analysis: string | null;
  what_i_learned: string | null;
  image_url: string | null;
  published: number;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: number;
  title: string;
  type: string;
  event_date: string;
  description: string;
  key_takeaway: string | null;
  image_url: string | null;
  published: number;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Reflection = {
  id: number;
  slug: string;
  title: string;
  content: string;
  tags: string; // JSON array
  image_url: string | null;
  published: number;
  post_date: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: number;
  created_at: string;
};

export type CVProfile = {
  id: number;
  full_name: string;
  headline: string;
  summary: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  links: string; // JSON array of {label, url}
  photo_url: string | null;
};

export type CVEducation = {
  id: number;
  institution: string;
  degree: string;
  field: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  order_index: number;
};

export type CVExperience = {
  id: number;
  organization: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  order_index: number;
};

export type CVSkill = {
  id: number;
  category: string;
  name: string;
  level: number;
  order_index: number;
};

export type CVLeadership = {
  id: number;
  role: string;
  organization: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  order_index: number;
};

// ---------- Helpers ----------

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// `table` is always a trusted hardcoded literal from call sites below, never user input.
async function uniqueSlug(table: string, base: string, excludeId?: number): Promise<string> {
  let slug = slugify(base) || "item";
  let n = 1;
  while (true) {
    const query = excludeId
      ? `SELECT id FROM ${table} WHERE slug = $1 AND id != $2`
      : `SELECT id FROM ${table} WHERE slug = $1`;
    const params = excludeId ? [slug, excludeId] : [slug];
    const rows = await sql.unsafe(query, params);
    if (rows.length === 0) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

// ---------- Projects ----------

export const ProjectsRepo = {
  async all(publishedOnly = false): Promise<Project[]> {
    return publishedOnly
      ? await sql<Project[]>`SELECT * FROM projects WHERE published = 1 ORDER BY order_index ASC, created_at DESC`
      : await sql<Project[]>`SELECT * FROM projects ORDER BY order_index ASC, created_at DESC`;
  },
  async bySlug(slug: string): Promise<Project | undefined> {
    const rows = await sql<Project[]>`SELECT * FROM projects WHERE slug = ${slug}`;
    return rows[0];
  },
  async byId(id: number): Promise<Project | undefined> {
    const rows = await sql<Project[]>`SELECT * FROM projects WHERE id = ${id}`;
    return rows[0];
  },
  async create(data: Partial<Project>): Promise<Project> {
    const slug = await uniqueSlug("projects", data.slug || data.title || "project");
    const rows = await sql<Project[]>`
      INSERT INTO projects (slug, title, description, problem, solution, impact, tech_stack, image_url, github_url, demo_url, featured, published, order_index, updated_at)
      VALUES (${slug}, ${data.title || "Untitled project"}, ${data.description || ""}, ${data.problem ?? null}, ${data.solution ?? null}, ${data.impact ?? null}, ${data.tech_stack ?? "[]"}, ${data.image_url ?? null}, ${data.github_url ?? null}, ${data.demo_url ?? null}, ${data.featured ?? 0}, ${data.published ?? 1}, ${data.order_index ?? 0}, now()::text)
      RETURNING *
    `;
    return rows[0];
  },
  async update(id: number, data: Partial<Project>): Promise<Project | undefined> {
    const existing = await this.byId(id);
    if (!existing) return undefined;
    const slug =
      data.title && data.title !== existing.title
        ? await uniqueSlug("projects", data.title, id)
        : existing.slug;
    const rows = await sql<Project[]>`
      UPDATE projects SET
        slug = ${slug}, title = ${data.title ?? existing.title}, description = ${data.description ?? existing.description},
        problem = ${data.problem ?? existing.problem}, solution = ${data.solution ?? existing.solution}, impact = ${data.impact ?? existing.impact},
        tech_stack = ${data.tech_stack ?? existing.tech_stack}, image_url = ${data.image_url ?? existing.image_url},
        github_url = ${data.github_url ?? existing.github_url}, demo_url = ${data.demo_url ?? existing.demo_url},
        featured = ${data.featured ?? existing.featured}, published = ${data.published ?? existing.published},
        order_index = ${data.order_index ?? existing.order_index}, updated_at = now()::text
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0];
  },
  async remove(id: number): Promise<void> {
    await sql`DELETE FROM projects WHERE id = ${id}`;
  },
};

// ---------- Cyber entries ----------

export const CyberRepo = {
  async all(publishedOnly = false): Promise<CyberEntry[]> {
    return publishedOnly
      ? await sql<CyberEntry[]>`SELECT * FROM cyber_entries WHERE published = 1 ORDER BY order_index ASC, created_at DESC`
      : await sql<CyberEntry[]>`SELECT * FROM cyber_entries ORDER BY order_index ASC, created_at DESC`;
  },
  async bySlug(slug: string): Promise<CyberEntry | undefined> {
    const rows = await sql<CyberEntry[]>`SELECT * FROM cyber_entries WHERE slug = ${slug}`;
    return rows[0];
  },
  async byId(id: number): Promise<CyberEntry | undefined> {
    const rows = await sql<CyberEntry[]>`SELECT * FROM cyber_entries WHERE id = ${id}`;
    return rows[0];
  },
  async create(data: Partial<CyberEntry>): Promise<CyberEntry> {
    const slug = await uniqueSlug("cyber_entries", data.slug || data.title || "entry");
    const rows = await sql<CyberEntry[]>`
      INSERT INTO cyber_entries (slug, title, description, category, tools_used, logs_analysis, what_i_learned, image_url, published, order_index, updated_at)
      VALUES (${slug}, ${data.title || "Untitled entry"}, ${data.description || ""}, ${data.category || "Blue Team"}, ${data.tools_used ?? "[]"}, ${data.logs_analysis ?? null}, ${data.what_i_learned ?? null}, ${data.image_url ?? null}, ${data.published ?? 1}, ${data.order_index ?? 0}, now()::text)
      RETURNING *
    `;
    return rows[0];
  },
  async update(id: number, data: Partial<CyberEntry>): Promise<CyberEntry | undefined> {
    const existing = await this.byId(id);
    if (!existing) return undefined;
    const slug =
      data.title && data.title !== existing.title
        ? await uniqueSlug("cyber_entries", data.title, id)
        : existing.slug;
    const rows = await sql<CyberEntry[]>`
      UPDATE cyber_entries SET
        slug = ${slug}, title = ${data.title ?? existing.title}, description = ${data.description ?? existing.description},
        category = ${data.category ?? existing.category}, tools_used = ${data.tools_used ?? existing.tools_used},
        logs_analysis = ${data.logs_analysis ?? existing.logs_analysis}, what_i_learned = ${data.what_i_learned ?? existing.what_i_learned},
        image_url = ${data.image_url ?? existing.image_url}, published = ${data.published ?? existing.published},
        order_index = ${data.order_index ?? existing.order_index}, updated_at = now()::text
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0];
  },
  async remove(id: number): Promise<void> {
    await sql`DELETE FROM cyber_entries WHERE id = ${id}`;
  },
};

// ---------- Experiences ----------

export const ExperiencesRepo = {
  async all(publishedOnly = false): Promise<Experience[]> {
    return publishedOnly
      ? await sql<Experience[]>`SELECT * FROM experiences WHERE published = 1 ORDER BY event_date DESC`
      : await sql<Experience[]>`SELECT * FROM experiences ORDER BY event_date DESC`;
  },
  async byId(id: number): Promise<Experience | undefined> {
    const rows = await sql<Experience[]>`SELECT * FROM experiences WHERE id = ${id}`;
    return rows[0];
  },
  async create(data: Partial<Experience>): Promise<Experience> {
    const rows = await sql<Experience[]>`
      INSERT INTO experiences (title, type, event_date, description, key_takeaway, image_url, published, order_index, updated_at)
      VALUES (${data.title || "Untitled experience"}, ${data.type || "Training"}, ${data.event_date || new Date().toISOString().slice(0, 10)}, ${data.description || ""}, ${data.key_takeaway ?? null}, ${data.image_url ?? null}, ${data.published ?? 1}, ${data.order_index ?? 0}, now()::text)
      RETURNING *
    `;
    return rows[0];
  },
  async update(id: number, data: Partial<Experience>): Promise<Experience | undefined> {
    const existing = await this.byId(id);
    if (!existing) return undefined;
    const rows = await sql<Experience[]>`
      UPDATE experiences SET
        title = ${data.title ?? existing.title}, type = ${data.type ?? existing.type}, event_date = ${data.event_date ?? existing.event_date},
        description = ${data.description ?? existing.description}, key_takeaway = ${data.key_takeaway ?? existing.key_takeaway},
        image_url = ${data.image_url ?? existing.image_url}, published = ${data.published ?? existing.published},
        order_index = ${data.order_index ?? existing.order_index}, updated_at = now()::text
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0];
  },
  async remove(id: number): Promise<void> {
    await sql`DELETE FROM experiences WHERE id = ${id}`;
  },
};

// ---------- Reflections ----------

export const ReflectionsRepo = {
  async all(publishedOnly = false): Promise<Reflection[]> {
    return publishedOnly
      ? await sql<Reflection[]>`SELECT * FROM reflections WHERE published = 1 ORDER BY post_date DESC`
      : await sql<Reflection[]>`SELECT * FROM reflections ORDER BY post_date DESC`;
  },
  async bySlug(slug: string): Promise<Reflection | undefined> {
    const rows = await sql<Reflection[]>`SELECT * FROM reflections WHERE slug = ${slug}`;
    return rows[0];
  },
  async byId(id: number): Promise<Reflection | undefined> {
    const rows = await sql<Reflection[]>`SELECT * FROM reflections WHERE id = ${id}`;
    return rows[0];
  },
  async create(data: Partial<Reflection>): Promise<Reflection> {
    const slug = await uniqueSlug("reflections", data.slug || data.title || "reflection");
    const rows = await sql<Reflection[]>`
      INSERT INTO reflections (slug, title, content, tags, image_url, published, post_date, updated_at)
      VALUES (${slug}, ${data.title || "Untitled reflection"}, ${data.content || ""}, ${data.tags ?? "[]"}, ${data.image_url ?? null}, ${data.published ?? 1}, ${data.post_date || new Date().toISOString().slice(0, 10)}, now()::text)
      RETURNING *
    `;
    return rows[0];
  },
  async update(id: number, data: Partial<Reflection>): Promise<Reflection | undefined> {
    const existing = await this.byId(id);
    if (!existing) return undefined;
    const slug =
      data.title && data.title !== existing.title
        ? await uniqueSlug("reflections", data.title, id)
        : existing.slug;
    const rows = await sql<Reflection[]>`
      UPDATE reflections SET
        slug = ${slug}, title = ${data.title ?? existing.title}, content = ${data.content ?? existing.content},
        tags = ${data.tags ?? existing.tags}, image_url = ${data.image_url ?? existing.image_url},
        published = ${data.published ?? existing.published}, post_date = ${data.post_date ?? existing.post_date}, updated_at = now()::text
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0];
  },
  async remove(id: number): Promise<void> {
    await sql`DELETE FROM reflections WHERE id = ${id}`;
  },
};

// ---------- Messages ----------

export const MessagesRepo = {
  async all(): Promise<Message[]> {
    return await sql<Message[]>`SELECT * FROM messages ORDER BY created_at DESC`;
  },
  async byId(id: number): Promise<Message | undefined> {
    const rows = await sql<Message[]>`SELECT * FROM messages WHERE id = ${id}`;
    return rows[0];
  },
  async create(data: { name: string; email: string; message: string }): Promise<Message> {
    const rows = await sql<Message[]>`
      INSERT INTO messages (name, email, message) VALUES (${data.name}, ${data.email}, ${data.message})
      RETURNING *
    `;
    return rows[0];
  },
  async setRead(id: number, isRead: boolean): Promise<Message | undefined> {
    const rows = await sql<Message[]>`UPDATE messages SET is_read = ${isRead ? 1 : 0} WHERE id = ${id} RETURNING *`;
    return rows[0];
  },
  async remove(id: number): Promise<void> {
    await sql`DELETE FROM messages WHERE id = ${id}`;
  },
  async unreadCount(): Promise<number> {
    const rows = await sql<{ c: number }[]>`SELECT COUNT(*)::int as c FROM messages WHERE is_read = 0`;
    return rows[0].c;
  },
};

// ---------- CV ----------

export const CVRepo = {
  async profile(): Promise<CVProfile> {
    // Upsert-safe singleton bootstrap: only the first concurrent caller actually inserts.
    const inserted = await sql<CVProfile[]>`
      INSERT INTO cv_profile (id, full_name, headline, summary, email, phone, location, links, photo_url)
      VALUES (1, 'Deubaybe Dounia', 'Computer Science Student', 'Write a short summary about yourself.', '', '', '', '[]', NULL)
      ON CONFLICT (id) DO NOTHING
      RETURNING *
    `;
    if (inserted[0]) return inserted[0];

    const existing = await sql<CVProfile[]>`SELECT * FROM cv_profile WHERE id = 1`;
    let row = existing[0];
    if (row.full_name === "Your Name" || row.full_name === "Dounia") {
      const healed = await sql<CVProfile[]>`UPDATE cv_profile SET full_name = 'Deubaybe Dounia' WHERE id = 1 RETURNING *`;
      row = healed[0];
    }
    return row;
  },
  async updateProfile(data: Partial<CVProfile>): Promise<CVProfile> {
    const existing = await this.profile();
    const rows = await sql<CVProfile[]>`
      UPDATE cv_profile SET
        full_name = ${data.full_name ?? existing.full_name},
        headline = ${data.headline ?? existing.headline},
        summary = ${data.summary ?? existing.summary},
        email = ${data.email ?? existing.email},
        phone = ${data.phone ?? existing.phone},
        location = ${data.location ?? existing.location},
        links = ${data.links ?? existing.links},
        photo_url = ${data.photo_url ?? existing.photo_url}
      WHERE id = 1
      RETURNING *
    `;
    return rows[0];
  },
  async education(): Promise<CVEducation[]> {
    return await sql<CVEducation[]>`SELECT * FROM cv_education ORDER BY order_index ASC, start_date DESC`;
  },
  async experience(): Promise<CVExperience[]> {
    return await sql<CVExperience[]>`SELECT * FROM cv_experience ORDER BY order_index ASC, start_date DESC`;
  },
  async skills(): Promise<CVSkill[]> {
    return await sql<CVSkill[]>`SELECT * FROM cv_skills ORDER BY order_index ASC, category ASC`;
  },
  async leadership(): Promise<CVLeadership[]> {
    return await sql<CVLeadership[]>`SELECT * FROM cv_leadership ORDER BY order_index ASC, start_date DESC`;
  },
  async addEducation(d: Partial<CVEducation>): Promise<void> {
    await sql`
      INSERT INTO cv_education (institution, degree, field, start_date, end_date, description, order_index)
      VALUES (${d.institution || ""}, ${d.degree || ""}, ${d.field ?? null}, ${d.start_date || ""}, ${d.end_date ?? null}, ${d.description ?? null}, ${d.order_index ?? 0})
    `;
  },
  async addExperience(d: Partial<CVExperience>): Promise<void> {
    await sql`
      INSERT INTO cv_experience (organization, role, start_date, end_date, description, order_index)
      VALUES (${d.organization || ""}, ${d.role || ""}, ${d.start_date || ""}, ${d.end_date ?? null}, ${d.description ?? null}, ${d.order_index ?? 0})
    `;
  },
  async addSkill(d: Partial<CVSkill>): Promise<void> {
    await sql`
      INSERT INTO cv_skills (category, name, level, order_index)
      VALUES (${d.category || "General"}, ${d.name || ""}, ${d.level ?? 3}, ${d.order_index ?? 0})
    `;
  },
  async addLeadership(d: Partial<CVLeadership>): Promise<void> {
    await sql`
      INSERT INTO cv_leadership (role, organization, start_date, end_date, description, order_index)
      VALUES (${d.role || ""}, ${d.organization || ""}, ${d.start_date || ""}, ${d.end_date ?? null}, ${d.description ?? null}, ${d.order_index ?? 0})
    `;
  },
  async removeEducation(id: number): Promise<void> {
    await sql`DELETE FROM cv_education WHERE id = ${id}`;
  },
  async removeExperience(id: number): Promise<void> {
    await sql`DELETE FROM cv_experience WHERE id = ${id}`;
  },
  async removeSkill(id: number): Promise<void> {
    await sql`DELETE FROM cv_skills WHERE id = ${id}`;
  },
  async removeLeadership(id: number): Promise<void> {
    await sql`DELETE FROM cv_leadership WHERE id = ${id}`;
  },
};

// ---------- Admin users ----------

export type AdminUser = {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
};

export const AdminRepo = {
  async byEmail(email: string): Promise<AdminUser | undefined> {
    const rows = await sql<AdminUser[]>`SELECT * FROM admin_users WHERE email = ${email}`;
    return rows[0];
  },
  async create(email: string, passwordHash: string, name: string): Promise<void> {
    await sql`INSERT INTO admin_users (email, password_hash, name) VALUES (${email}, ${passwordHash}, ${name})`;
  },
  async count(): Promise<number> {
    const rows = await sql<{ c: number }[]>`SELECT COUNT(*)::int as c FROM admin_users`;
    return rows[0].c;
  },
};
