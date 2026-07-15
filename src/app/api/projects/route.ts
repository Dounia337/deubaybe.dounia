import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ProjectsRepo } from "@/db/repo";
import { requireAdmin, getSession } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  problem: z.string().optional(),
  solution: z.string().optional(),
  impact: z.string().optional(),
  tech_stack: z.array(z.string()).default([]),
  image_url: z.string().optional(),
  github_url: z.string().optional(),
  demo_url: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order_index: z.number().default(0),
});

export async function GET(req: NextRequest) {
  try {
    const isAdminRequest = req.nextUrl.searchParams.get("all") === "1";
    // Public callers only ever see published projects; the admin UI passes ?all=1
    // and is already gated by middleware for non-GET, so double check the session here too.
    let publishedOnly = true;
    if (isAdminRequest) {
      const session = await getSession();
      publishedOnly = !session;
    }
    const projects = (await ProjectsRepo.all(publishedOnly)).map((p) => ({
      ...p,
      tech_stack: JSON.parse(p.tech_stack || "[]"),
    }));
    return NextResponse.json({ projects });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data = projectSchema.parse(body);
    const project = await ProjectsRepo.create({
      ...data,
      tech_stack: JSON.stringify(data.tech_stack),
      featured: data.featured ? 1 : 0,
      published: data.published ? 1 : 0,
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
