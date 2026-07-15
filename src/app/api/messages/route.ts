import { NextResponse } from "next/server";
import { MessagesRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ messages: await MessagesRepo.all() });
  } catch (err) {
    return handleApiError(err);
  }
}
