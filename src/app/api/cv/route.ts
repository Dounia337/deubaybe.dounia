import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CVRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const profile = await CVRepo.profile();
    return NextResponse.json({
      profile: { ...profile, links: JSON.parse(profile.links || "[]") },
      education: await CVRepo.education(),
      experience: await CVRepo.experience(),
      skills: await CVRepo.skills(),
      leadership: await CVRepo.leadership(),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

const profileSchema = z.object({
  full_name: z.string().min(1).optional(),
  headline: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  photo_url: z.string().nullable().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const data = profileSchema.parse(await req.json());
    const profile = await CVRepo.updateProfile({
      ...data,
      links: data.links ? JSON.stringify(data.links) : undefined,
    });
    return NextResponse.json({ profile: { ...profile, links: JSON.parse(profile.links || "[]") } });
  } catch (err) {
    return handleApiError(err);
  }
}
