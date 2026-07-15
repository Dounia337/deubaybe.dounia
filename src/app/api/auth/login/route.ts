import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AdminRepo } from "@/db/repo";
import { verifyPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const admin = await AdminRepo.byEmail(email.toLowerCase());

  // Always run a compare even on a missing user, to avoid leaking account existence via timing.
  const validPassword = admin
    ? await verifyPassword(password, admin.password_hash)
    : await verifyPassword(password, "$2a$12$invalidsaltinvalidsaltinvalidsaltinvalidsal");

  if (!admin || !validPassword) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const token = await createSessionToken({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
  });

  const res = NextResponse.json({ ok: true, name: admin.name });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
