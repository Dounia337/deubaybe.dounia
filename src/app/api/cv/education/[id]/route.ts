import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CVRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

// Every field optional (a genuine partial update) — none of them use .default(), since a
// zod default fills in for a field the client never sent, which would silently reset it.
const schema = z.object({
  institution: z.string().min(1).optional(),
  degree: z.string().min(1).optional(),
  field: z.string().optional(),
  start_date: z.string().min(1).optional(),
  end_date: z.string().optional(),
  description: z.string().optional(),
  order_index: z.number().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const data = schema.parse(await req.json());
    const education = await CVRepo.updateEducation(Number(id), data);
    if (!education) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ education });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await CVRepo.removeEducation(Number(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
