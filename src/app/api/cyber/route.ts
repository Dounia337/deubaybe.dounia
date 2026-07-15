import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CyberRepo } from "@/db/repo";
import { requireAdmin, getSession } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().default("Blue Team"),
  tools_used: z.array(z.string()).default([]),
  logs_analysis: z.string().optional(),
  what_i_learned: z.string().optional(),
  image_url: z.string().nullable().optional(),
  published: z.boolean().default(true),
  order_index: z.number().default(0),
});

export async function GET(req: NextRequest) {
  try {
    const isAdminRequest = req.nextUrl.searchParams.get("all") === "1";
    let publishedOnly = true;
    if (isAdminRequest) {
      const session = await getSession();
      publishedOnly = !session;
    }
    const entries = (await CyberRepo.all(publishedOnly)).map((e) => ({
      ...e,
      tools_used: JSON.parse(e.tools_used || "[]"),
    }));
    return NextResponse.json({ entries });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = schema.parse(await req.json());
    const entry = await CyberRepo.create({
      ...data,
      tools_used: JSON.stringify(data.tools_used),
      published: data.published ? 1 : 0,
    });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
