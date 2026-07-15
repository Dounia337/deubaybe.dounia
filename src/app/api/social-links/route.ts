import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SocialLinksRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const links = await SocialLinksRepo.all();
    return NextResponse.json({ links });
  } catch (err) {
    return handleApiError(err);
  }
}

const bodySchema = z.object({
  links: z.array(
    z.object({
      platform: z.enum(["linkedin", "instagram", "facebook", "youtube"]),
      url: z.string(),
      visible: z.boolean(),
    })
  ),
});

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { links } = bodySchema.parse(await req.json());
    const saved = await Promise.all(
      links.map((l) => SocialLinksRepo.upsert(l.platform, { url: l.url, visible: l.visible }))
    );
    return NextResponse.json({ links: saved });
  } catch (err) {
    return handleApiError(err);
  }
}
