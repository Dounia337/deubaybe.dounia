import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { HeroRolesRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const roles = await HeroRolesRepo.all();
    return NextResponse.json({ roles });
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({ text: z.string().min(1, "Text is required") });

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { text } = createSchema.parse(await req.json());
    const role = await HeroRolesRepo.add(text);
    return NextResponse.json({ role }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

const reorderSchema = z.object({ ids: z.array(z.number()) });

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { ids } = reorderSchema.parse(await req.json());
    await HeroRolesRepo.reorder(ids);
    const roles = await HeroRolesRepo.all();
    return NextResponse.json({ roles });
  } catch (err) {
    return handleApiError(err);
  }
}
