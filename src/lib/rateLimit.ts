const store = new Map<
  string,
  { count: number; resetAt: number }
>();

const getWindowSec = () =>
  Math.max(1, parseInt(process.env.RATE_LIMIT_WINDOW_SEC ?? "60", 10));
const getMax = () =>
  Math.max(1, parseInt(process.env.RATE_LIMIT_MAX ?? "10", 10));

export function checkRateLimit(ip: string): { ok: boolean; retryAfterSec?: number } {
  const windowSec = getWindowSec();
  const max = getMax();
  const now = Math.floor(Date.now() / 1000);
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + windowSec });
    return { ok: true };
  }

  if (now >= entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowSec });
    return { ok: true };
  }

  entry.count += 1;
  if (entry.count > max) {
    return { ok: false, retryAfterSec: entry.resetAt - now };
  }
  return { ok: true };
}
