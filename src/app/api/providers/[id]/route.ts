import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const provider = await prisma.provider.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      category: true,
      subcategory: true,
      locationCity: true,
      serviceCities: true,
      isNationwide: true,
      description: true,
      videoLinks: true,
      imageKey: true,
      coverImageKey: true,
      galleryImageKeys: true,
      createdAt: true,
    },
  });

  if (!provider) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(provider);
}
