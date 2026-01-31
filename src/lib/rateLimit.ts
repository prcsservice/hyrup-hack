import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, increment } from 'firebase/firestore';

const RATE_LIMIT_COLLECTION = 'rateLimits';

interface RateLimitConfig {
    maxRequests: number;      // Max requests allowed
    windowMs: number;         // Time window in milliseconds
}

// Default rate limits for different actions
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
    email_send: { maxRequests: 10, windowMs: 60 * 1000 },           // 10 emails/minute
    email_broadcast: { maxRequests: 2, windowMs: 10 * 60 * 1000 },  // 2 broadcasts/10min
    team_create: { maxRequests: 3, windowMs: 60 * 60 * 1000 },      // 3 teams/hour
    submission: { maxRequests: 10, windowMs: 60 * 1000 },           // 10 submissions/minute
    join_request: { maxRequests: 5, windowMs: 5 * 60 * 1000 },      // 5 join requests/5min
};

/**
 * Check if an action should be rate limited
 * Returns { allowed: boolean, remaining: number, resetAt: Date }
 */
export async function checkRateLimit(
    userId: string,
    action: keyof typeof RATE_LIMITS
): Promise<{ allowed: boolean; remaining: number; resetAt: Date | null }> {
    const config = RATE_LIMITS[action];
    if (!config) {
        return { allowed: true, remaining: Infinity, resetAt: null };
    }

    const docId = `${userId}_${action}`;
    const docRef = doc(db, RATE_LIMIT_COLLECTION, docId);

    try {
        const docSnap = await getDoc(docRef);
        const now = Date.now();

        if (!docSnap.exists()) {
            // First request - create rate limit doc
            await setDoc(docRef, {
                count: 1,
                windowStart: serverTimestamp(),
                windowStartMs: now,
            });
            return {
                allowed: true,
                remaining: config.maxRequests - 1,
                resetAt: new Date(now + config.windowMs),
            };
        }

        const data = docSnap.data();
        const windowStart = data.windowStartMs || 0;
        const count = data.count || 0;
        const windowEnd = windowStart + config.windowMs;

        // Window expired - reset
        if (now > windowEnd) {
            await setDoc(docRef, {
                count: 1,
                windowStart: serverTimestamp(),
                windowStartMs: now,
            });
            return {
                allowed: true,
                remaining: config.maxRequests - 1,
                resetAt: new Date(now + config.windowMs),
            };
        }

        // Within window - check count
        if (count >= config.maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetAt: new Date(windowEnd),
            };
        }

        // Allow and increment
        await setDoc(docRef, { count: increment(1) }, { merge: true });
        return {
            allowed: true,
            remaining: config.maxRequests - count - 1,
            resetAt: new Date(windowEnd),
        };
    } catch (error) {
        console.error('Rate limit check failed:', error);
        // Fail open - allow action if rate limit check fails
        return { allowed: true, remaining: config.maxRequests, resetAt: null };
    }
}

/**
 * Wrapper that throws if rate limit exceeded
 */
export async function enforceRateLimit(
    userId: string,
    action: keyof typeof RATE_LIMITS
): Promise<void> {
    const result = await checkRateLimit(userId, action);
    if (!result.allowed) {
        const resetIn = result.resetAt
            ? Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)
            : 60;
        throw new Error(`Rate limit exceeded. Try again in ${resetIn} seconds.`);
    }
}
