import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ExperiencesRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({
  title: z.string().min(1),
  type: z.enum(["Training", "Conference", "Leadership", "Convening", "Workshop"]).default("Training"),
  event_date: z.string().min(1),
  description: z.string().min(1),
  key_takeaway: z.string().optional(),
  image_url: z.string().optional(),
  published: z.boolean().default(true),
  order_index: z.number().default(0),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const experience = await ExperiencesRepo.byId(Number(id));
    if (!experience) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ experience });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const data = schema.partial().parse(await req.json());
    const experience = await ExperiencesRepo.update(Number(id), {
      ...data,
      published: data.published === undefined ? undefined : data.published ? 1 : 0,
    });
    if (!experience) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ experience });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await ExperiencesRepo.remove(Number(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
