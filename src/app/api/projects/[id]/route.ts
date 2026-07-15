import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ProjectsRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  problem: z.string().optional(),
  solution: z.string().optional(),
  impact: z.string().optional(),
  tech_stack: z.array(z.string()).default([]),
  image_url: z.string().optional(),
  github_url: z.string().optional(),
  demo_url: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order_index: z.number().default(0),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await ProjectsRepo.byId(Number(id));
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      project: { ...project, tech_stack: JSON.parse(project.tech_stack || "[]") },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const data = projectSchema.partial().parse(body);
    const project = await ProjectsRepo.update(Number(id), {
      ...data,
      tech_stack: data.tech_stack ? JSON.stringify(data.tech_stack) : undefined,
      featured: data.featured === undefined ? undefined : data.featured ? 1 : 0,
      published: data.published === undefined ? undefined : data.published ? 1 : 0,
    });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ project });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await ProjectsRepo.remove(Number(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
