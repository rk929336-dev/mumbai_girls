import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Fail closed in production: do not accept unauthenticated public submissions
// when the shared limiter is misconfigured or unavailable.
const configured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN &&
  !process.env.UPSTASH_REDIS_REST_URL.includes("your-db") &&
  !process.env.UPSTASH_REDIS_REST_TOKEN.includes("your-token"),
);
const limiter = configured
  ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, "10 m"), prefix: "inquiry" })
  : null;
const adminLimiter = configured
  ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(10, "10 m"), prefix: "admin-login" })
  : null;

export async function limitInquiry(ip: string) {
  if (!limiter) {
    if (process.env.NODE_ENV === "production") throw new Error("Rate limiter is not configured");
    return { success: true, reset: Date.now() + 600_000 };
  }
  return limiter.limit(ip);
}

export async function limitAdminLogin(ip: string) {
  if (!adminLimiter) {
    if (process.env.NODE_ENV === "production") throw new Error("Rate limiter is not configured");
    return { success: true, reset: Date.now() + 600_000 };
  }
  return adminLimiter.limit(ip);
}
