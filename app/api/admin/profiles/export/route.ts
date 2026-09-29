import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { toCsv } from "@/lib/profile-csv";

export async function GET(request: NextRequest) { const denied = requireAdmin(request); if (denied) return denied; const profiles = await db.profile.findMany({ orderBy: { createdAt: "desc" } }); const csv = toCsv(profiles as unknown as Record<string, unknown>[]); return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="mumbai-profiles-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } }); }
