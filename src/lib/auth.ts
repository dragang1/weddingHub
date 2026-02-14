import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function getSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN ?? "";
}

export async function isAdmin(): Promise<boolean> {
  const expected = getSessionToken();
  if (!expected) return false;
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  try {
    return cookie.length === expected.length && timingSafeEqual(Buffer.from(cookie, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

export async function setAdminCookie(): Promise<void> {
  const token = getSessionToken();
  if (!token) return;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  try {
    return password.length === expected.length && timingSafeEqual(Buffer.from(password, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}
