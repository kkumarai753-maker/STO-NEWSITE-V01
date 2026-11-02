import "server-only";

/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Good enough for a single long-lived Node process. On serverless or
 * multi-instance deployments, back this with a shared store (e.g. Redis /
 * Upstash), the `RateLimiter` interface stays the same.
 */
export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export type RateLimiter = (key: string) => RateLimitResult;

export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}): RateLimiter {
  const hits = new Map<string, number[]>();
  let lastSweep = Date.now();

  return (key: string) => {
    const now = Date.now();

    // Opportunistic cleanup so the map cannot grow without bound.
    if (now - lastSweep > windowMs) {
      for (const [k, timestamps] of hits) {
        if (timestamps.every((t) => now - t > windowMs)) hits.delete(k);
      }
      lastSweep = now;
    }

    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      const retryAfterMs = windowMs - (now - recent[0]);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      };
    }

    recent.push(now);
    hits.set(key, recent);
    return { allowed: true, remaining: limit - recent.length, retryAfterSeconds: 0 };
  };
}

/** Best-effort client identifier from proxy headers. */
export function clientKeyFromHeaders(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "anonymous";
}
