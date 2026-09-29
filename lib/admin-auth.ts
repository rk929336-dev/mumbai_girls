import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "mumbai_admin_session";

function config() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) throw new Error("ADMIN_PASSWORD and ADMIN_SESSION_SECRET are required");
  return { password, secret };
}

function digest(value: string) { return createHash("sha256").update(value).digest(); }
export function verifyPassword(input: string) {
  const expected = digest(config().password);
  const actual = digest(input);
  return timingSafeEqual(actual, expected);
}

function token() {
  const { secret } = config();
  return createHmac("sha256", secret).update("mumbai-directory-admin-v1").digest("hex");
}

export function isAdmin(request: NextRequest) {
  try { return request.cookies.get(ADMIN_COOKIE)?.value === token(); } catch { return false; }
}

export function setAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, token(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 8 });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
}

export function requireAdmin(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  return null;
}
