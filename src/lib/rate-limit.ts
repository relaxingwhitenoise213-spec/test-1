/**
 * Minimal fixed-window rate limiter (in-memory).
 *
 * Suitable for a single-instance deployment or development. For multi-instance
 * production use, swap the Map for a shared store (e.g. Upstash Redis) behind
 * this same interface.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

export function rateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt, limit };
  }

  bucket.count += 1;
  const success = bucket.count <= limit;
  return {
    success,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
    limit,
  };
}

/** Best-effort client identifier from request headers. */
export function clientKey(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "anonymous"
  );
}
