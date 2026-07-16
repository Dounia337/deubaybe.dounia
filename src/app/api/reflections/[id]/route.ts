import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ReflectionsRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
  image_url: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  post_date: z.string().min(1),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const reflection = await ReflectionsRepo.byId(Number(id));
    if (!reflection) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ reflection: { ...reflection, tags: JSON.parse(reflection.tags || "[]") } });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const data = schema.partial().parse(await req.json());
    const reflection = await ReflectionsRepo.update(Number(id), {
      ...data,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
      featured: data.featured === undefined ? undefined : data.featured ? 1 : 0,
      published: data.published === undefined ? undefined : data.published ? 1 : 0,
    });
    if (!reflection) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ reflection });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await ReflectionsRepo.remove(Number(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
