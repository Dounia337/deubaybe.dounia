import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MessagesRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({ is_read: z.boolean() });

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { is_read } = schema.parse(await req.json());
    const message = await MessagesRepo.setRead(Number(id), is_read);
    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await MessagesRepo.remove(Number(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
