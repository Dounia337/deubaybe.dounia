import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";
import { saveUploadedImage } from "@/lib/upload";
import { ApiError } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new ApiError(400, "No file was uploaded.");
    }
    const url = await saveUploadedImage(file);
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
