import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CVRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({
  organization: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
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
    const experience = await CVRepo.updateExperience(Number(id), data);
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
    await CVRepo.removeExperience(Number(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
