interface RateLimitResult {
    success: boolean;
    reset: number;
    remaining: number;
}

// Simple in-memory rate limiter
// For production, consider using Redis or other distributed storage
const requests = new Map<
    string,
    { count: number; resetTime: number }
>();

export async function rateLimiter(
    identifier: string,
    limit = 100,
    windowMs = 15 * 60 * 1000 // 15 minutes
): Promise<RateLimitResult> {
    const now = Date.now();
    const resetTime = now + windowMs;

    const existing = requests.get(identifier);

    if (!existing || now > existing.resetTime) {
        // Create new entry or reset expired entry
        requests.set(identifier, { count: 1, resetTime });
        return {
            success: true,
            reset: resetTime,
            remaining: limit - 1,
        };
    }

    // Increment existing entry
    existing.count++;

    if (existing.count > limit) {
        return {
            success: false,
            reset: existing.resetTime,
            remaining: 0,
        };
    }

    return {
        success: true,
        reset: existing.resetTime,
        remaining: limit - existing.count,
    };
}

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requests.entries()) {
        if (now > value.resetTime) {
            requests.delete(key);
        }
    }
}, 60 * 1000); // Clean up every minute
