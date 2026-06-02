import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getApiKeyUser } from "@/lib/api-auth";
import { linkCreateSchema } from "@/lib/validators";

async function resolveUser(request: Request, scope: string) {
  const apiUser = await getApiKeyUser(request, scope);

  if (apiUser) {
    return apiUser.id;
  }

  const sessionUser = await requireUser();
  return sessionUser.id;
}

export async function GET(request: Request) {
  const userId = await resolveUser(request, "links:read");
  const profile = await prisma.profile.findUnique({ where: { userId } });

  if (!profile) {
    return NextResponse.json({ links: [] });
  }

  const links = await prisma.link.findMany({
    where: { profileId: profile.id },
    orderBy: { position: "asc" }
  });

  return NextResponse.json({ links });
}

export async function POST(request: Request) {
  const userId = await resolveUser(request, "links:write");
  const data = linkCreateSchema.parse(await request.json());
  const profile = await prisma.profile.findUnique({ where: { userId } });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const link = await prisma.link.create({
    data: {
      ...data,
      icon: data.icon || null,
      profileId: profile.id
    }
  });

  return NextResponse.json({ link }, { status: 201 });
}
