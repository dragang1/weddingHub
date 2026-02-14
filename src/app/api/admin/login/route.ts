import { NextRequest } from "next/server";
import { z } from "zod";
import { verifyPassword, setAdminCookie } from "@/lib/auth";

const bodySchema = z.object({ password: z.string() });

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Missing password" }, { status: 400 });
  }

  if (!verifyPassword(parsed.data.password)) {
    return Response.json({ error: "Neispravna lozinka" }, { status: 401 });
  }

  await setAdminCookie();
  return Response.json({ ok: true });
}
