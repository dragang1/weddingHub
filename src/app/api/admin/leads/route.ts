import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(request: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;

  const sp = request.nextUrl.searchParams;
  const providerId = sp.get("providerId") ?? undefined;

  const leads = await prisma.lead.findMany({
    where: providerId ? { providerId } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      provider: {
        select: { id: true, name: true, category: true },
      },
    },
  });
  return Response.json(leads);
}
