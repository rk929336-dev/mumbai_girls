import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const filters = z.object({
  hub: z.string().trim().max(60).optional(),
  category: z.string().trim().max(60).optional(),
  minPrice: z.coerce.number().int().min(0).max(1_000_000).optional(),
  maxPrice: z.coerce.number().int().min(0).max(1_000_000).optional(),
  sort: z.enum(["price_asc", "price_desc", "newest"]).default("newest"),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
});

export async function GET(request: NextRequest) {
  const parsed = filters.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
  const { hub, category, minPrice, maxPrice, sort, page } = parsed.data;
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
    return NextResponse.json({ error: "minPrice must be at most maxPrice" }, { status: 400 });

  const where = {
    active: true,
    ...(hub ? { hub: { equals: hub, mode: "insensitive" as const } } : {}),
    ...(category ? { categories: { has: category } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined ? { hourlyRate: { ...(minPrice !== undefined ? { gte: minPrice } : {}), ...(maxPrice !== undefined ? { lte: maxPrice } : {}) } } : {}),
  };
  const orderBy = sort === "price_asc" ? { hourlyRate: "asc" as const } : sort === "price_desc" ? { hourlyRate: "desc" as const } : { createdAt: "desc" as const };
  const [items, total] = await Promise.all([
    db.profile.findMany({ where, orderBy, skip: (page - 1) * 24, take: 24, select: { id: true, slug: true, name: true, age: true, city: true, hub: true, categories: true, hourlyRate: true, dailyRate: true, whatsappNumber: true, galleryUrls: true, verified: true, available: true } }),
    db.profile.count({ where }),
  ]);
  return NextResponse.json({ items, total, page, pageSize: 24 }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } });
}
