import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { HeroRolesRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({ text: z.string().min(1) });

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { text } = schema.parse(await req.json());
    const role = await HeroRolesRepo.update(Number(id), text);
    if (!role) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ role });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await HeroRolesRepo.remove(Number(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
