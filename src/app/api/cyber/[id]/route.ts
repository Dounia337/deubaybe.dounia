import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CyberRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().optional(),
  tools_used: z.array(z.string()).optional(),
  logs_analysis: z.string().optional(),
  what_i_learned: z.string().optional(),
  image_url: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  order_index: z.number().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const entry = await CyberRepo.byId(Number(id));
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ entry: { ...entry, tools_used: JSON.parse(entry.tools_used || "[]") } });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const data = schema.partial().parse(await req.json());
    const entry = await CyberRepo.update(Number(id), {
      ...data,
      tools_used: data.tools_used ? JSON.stringify(data.tools_used) : undefined,
      featured: data.featured === undefined ? undefined : data.featured ? 1 : 0,
      published: data.published === undefined ? undefined : data.published ? 1 : 0,
    });
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ entry });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await CyberRepo.remove(Number(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
