import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CVRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({
  organization: z.string().min(1),
  role: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().optional(),
  description: z.string().optional(),
  order_index: z.number().default(0),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = schema.parse(await req.json());
    await CVRepo.addExperience(data);
    return NextResponse.json({ experience: await CVRepo.experience() }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
