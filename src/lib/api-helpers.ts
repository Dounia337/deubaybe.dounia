import { NextResponse } from "next/server";
import { ApiError } from "./session";
import { ZodError } from "zod";

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "Some fields need fixing.", issues: err.flatten().fieldErrors },
      { status: 400 }
    );
  }
  console.error(err);
  return NextResponse.json({ error: "Something went wrong on the server." }, { status: 500 });
}
