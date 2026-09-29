import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { profileInput } from "@/lib/profile-validation";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: NextRequest, { params }: Context) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { id } = await params; let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = profileInput.safeParse(body); if (!parsed.success) return NextResponse.json({ error: "Invalid profile", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  try { const item = await db.profile.update({ where: { id }, data: parsed.data }); return NextResponse.json({ item }); }
  catch { return NextResponse.json({ error: "Profile not found or slug already exists" }, { status: 404 }); }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { id } = await params;
  try { await db.profile.delete({ where: { id } }); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "Profile not found" }, { status: 404 }); }
}
