import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { limitAdminLogin } from "@/lib/rate-limit";
import { setAdminCookie, verifyPassword } from "@/lib/admin-auth";

const schema = z.object({ password: z.string().min(1).max(256) });

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Password is required" }, { status: 400 });
  try {
    const result = await limitAdminLogin(request.headers.get("x-real-ip") ?? "unknown");
    if (!result.success) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
    if (!verifyPassword(parsed.data.password)) return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch { return NextResponse.json({ error: "Admin login is not configured" }, { status: 503 }); }
  const response = NextResponse.json({ ok: true });
  setAdminCookie(response);
  return response;
}
