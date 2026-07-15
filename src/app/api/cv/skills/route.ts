import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CVRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({
  category: z.string().min(1),
  name: z.string().min(1),
  level: z.number().min(1).max(5).default(3),
  order_index: z.number().default(0),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = schema.parse(await req.json());
    await CVRepo.addSkill(data);
    return NextResponse.json({ skills: await CVRepo.skills() }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
