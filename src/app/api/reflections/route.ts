import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ReflectionsRepo } from "@/db/repo";
import { requireAdmin, getSession } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).default([]),
  image_url: z.string().nullable().optional(),
  published: z.boolean().default(true),
  post_date: z.string().min(1, "Date is required"),
});

export async function GET(req: NextRequest) {
  try {
    const isAdminRequest = req.nextUrl.searchParams.get("all") === "1";
    let publishedOnly = true;
    if (isAdminRequest) {
      const session = await getSession();
      publishedOnly = !session;
    }
    const reflections = (await ReflectionsRepo.all(publishedOnly)).map((r) => ({
      ...r,
      tags: JSON.parse(r.tags || "[]"),
    }));
    return NextResponse.json({ reflections });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = schema.parse(await req.json());
    const reflection = await ReflectionsRepo.create({
      ...data,
      tags: JSON.stringify(data.tags),
      published: data.published ? 1 : 0,
    });
    return NextResponse.json({ reflection }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
