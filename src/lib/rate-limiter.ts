/**
 * Enterprise Bounded Sliding-Window Rate Limiter (PILLAR 5)
 *
 * Replaces raw in-memory maps with a memory-bounded store featuring
 * periodic automatic sweep cycles and FIFO/LRU eviction safeguards,
 * ensuring zero process memory leakage during volumetric abuse or distributed DoS attacks.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export class BoundedRateLimiter {
  private map = new Map<string, RateLimitRecord>();
  private readonly maxLimit: number;
  private readonly windowMs: number;
  private readonly maxEntries: number;
  private lastSweep = Date.now();
  private readonly sweepIntervalMs = 60 * 1000; // 60 seconds

  constructor(options: { maxLimit: number; windowMs: number; maxEntries?: number }) {
    this.maxLimit = options.maxLimit;
    this.windowMs = options.windowMs;
    this.maxEntries = options.maxEntries || 10000;
  }

  private sweepExpired(now: number) {
    // Only sweep if 60 seconds have elapsed or if nearing maximum entry threshold
    if (now - this.lastSweep < this.sweepIntervalMs && this.map.size < this.maxEntries) {
      return;
    }
    this.lastSweep = now;

    for (const [key, record] of this.map.entries()) {
      if (now > record.resetAt) {
        this.map.delete(key);
      }
    }

    // Defensive eviction if still overflowing maxEntries after sweeping
    if (this.map.size >= this.maxEntries) {
      const keysToEvict = Array.from(this.map.keys()).slice(0, Math.floor(this.maxEntries * 0.2));
      for (const k of keysToEvict) {
        this.map.delete(k);
      }
    }
  }

  /**
   * Evaluates if a request from the given identifier should be permitted
   */
  public check(key: string): {
    success: boolean;
    remaining: number;
    resetAt: number;
    retryAfterSeconds: number;
  } {
    const now = Date.now();
    this.sweepExpired(now);

    const record = this.map.get(key);

    if (!record || now > record.resetAt) {
      const resetAt = now + this.windowMs;
      this.map.set(key, { count: 1, resetAt });
      return {
        success: true,
        remaining: this.maxLimit - 1,
        resetAt,
        retryAfterSeconds: 0,
      };
    }

    if (record.count >= this.maxLimit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
      return {
        success: false,
        remaining: 0,
        resetAt: record.resetAt,
        retryAfterSeconds,
      };
    }

    record.count += 1;
    return {
      success: true,
      remaining: this.maxLimit - record.count,
      resetAt: record.resetAt,
      retryAfterSeconds: 0,
    };
  }

  /**
   * Manually record a count increment (e.g. only on failed authentication attempts)
   */
  public recordFailure(key: string): {
    blocked: boolean;
    retryAfterSeconds: number;
  } {
    const now = Date.now();
    this.sweepExpired(now);

    const record = this.map.get(key);

    if (!record || now > record.resetAt) {
      this.map.set(key, { count: 1, resetAt: now + this.windowMs });
      return { blocked: false, retryAfterSeconds: 0 };
    }

    record.count += 1;
    if (record.count >= this.maxLimit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
      return { blocked: true, retryAfterSeconds };
    }

    return { blocked: false, retryAfterSeconds: 0 };
  }

  /**
   * Clears the rate limit record for a key upon successful action
   */
  public reset(key: string) {
    this.map.delete(key);
  }
}

// Global Singleton Rate Limiters for Core Endpoints
export const leadsRateLimiter = new BoundedRateLimiter({
  maxLimit: 10, // max 10 requests
  windowMs: 60 * 1000, // per 60 seconds
  maxEntries: 10000,
});

export const authLoginRateLimiter = new BoundedRateLimiter({
  maxLimit: 5, // max 5 failed attempts
  windowMs: 5 * 60 * 1000, // per 5 minutes
  maxEntries: 10000,
});
