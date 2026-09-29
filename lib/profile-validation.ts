import { z } from "zod";

export const profileInput = z.object({
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(100), age: z.coerce.number().int().min(18).max(99),
  city: z.string().trim().min(2).max(80).default("Mumbai"), hub: z.string().trim().min(2).max(60),
  categories: z.array(z.string().trim().min(1).max(40)).max(10), hourlyRate: z.coerce.number().int().min(0).max(1_000_000),
  dailyRate: z.coerce.number().int().min(0).max(10_000_000).nullable().optional(),
  whatsappNumber: z.string().trim().regex(/^\+?[0-9]{7,15}$/).nullable().optional(),
  galleryUrls: z.array(z.string().url().max(2048)).max(12), verified: z.boolean().default(false), available: z.boolean().default(true), active: z.boolean().default(false),
});
