import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MessagesRepo } from "@/db/repo";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(1, "Message can't be empty").max(5000),
  // Honeypot field: real users never fill this in. Bots that auto-fill every
  // input will, so if it's non-empty we silently drop the submission.
  website: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (data.website) {
      // Honeypot tripped — pretend success, do nothing.
      return NextResponse.json({ ok: true });
    }

    await MessagesRepo.create({ name: data.name, email: data.email, message: data.message });

    // Optional email notification: wired up if SMTP_* env vars are present.
    // See README for setup — kept out of the hot path so contact form
    // submissions never fail just because email isn't configured.
    if (process.env.SMTP_HOST && process.env.NOTIFY_EMAIL) {
      import("@/lib/mailer")
        .then((m) => m.sendContactNotification(data))
        .catch((e) => console.error("Email notification failed:", e));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
