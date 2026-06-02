import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getApiKeyUser } from "@/lib/api-auth";
import { profileUpdateSchema } from "@/lib/validators";

function cleanOptional(value?: string) {
  return value === "" ? null : value;
}

async function resolveUserId(request: Request, scope: string) {
  const apiUser = await getApiKeyUser(request, scope);

  if (apiUser) {
    return apiUser.id;
  }

  const sessionUser = await requireUser();
  return sessionUser.id;
}

export async function GET(request: Request) {
  const userId = await resolveUserId(request, "profile:read");

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { links: { orderBy: { position: "asc" } }, badges: { include: { badge: true } } }
  });

  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const userId = await resolveUserId(request, "profile:write");
  const data = profileUpdateSchema.parse(await request.json());
  const existing = await prisma.profile.findUnique({ where: { username: data.username } });

  if (existing && existing.userId !== userId) {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }

  const profile = await prisma.profile.upsert({
    where: { userId },
    update: {
      ...data,
      bio: cleanOptional(data.bio),
      avatarUrl: cleanOptional(data.avatarUrl),
      bannerUrl: cleanOptional(data.bannerUrl),
      backgroundUrl: cleanOptional(data.backgroundUrl),
      musicUrl: cleanOptional(data.musicUrl),
      embedTitle: cleanOptional(data.embedTitle),
      embedDescription: cleanOptional(data.embedDescription)
    },
    create: {
      userId,
      ...data,
      bio: cleanOptional(data.bio),
      avatarUrl: cleanOptional(data.avatarUrl),
      bannerUrl: cleanOptional(data.bannerUrl),
      backgroundUrl: cleanOptional(data.backgroundUrl),
      musicUrl: cleanOptional(data.musicUrl),
      embedTitle: cleanOptional(data.embedTitle),
      embedDescription: cleanOptional(data.embedDescription)
    }
  });

  return NextResponse.json({ profile });
}
