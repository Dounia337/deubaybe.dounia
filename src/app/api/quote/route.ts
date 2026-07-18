import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { QuoteRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const quote = await QuoteRepo.get();
    return NextResponse.json({ quote });
  } catch (err) {
    return handleApiError(err);
  }
}

const bodySchema = z.object({
  quote: z.string().optional(),
  author: z.string().optional(),
  showLabel: z.boolean().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const data = bodySchema.parse(await req.json());
    const quote = await QuoteRepo.update({
      quote: data.quote,
      author: data.author,
      show_label: data.showLabel === undefined ? undefined : data.showLabel ? 1 : 0,
    });
    return NextResponse.json({ quote });
  } catch (err) {
    return handleApiError(err);
  }
}
