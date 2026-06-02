import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getApiKeyUser } from "@/lib/api-auth";
import { jsonError, parseJson } from "@/lib/api-response";
import { profileUpdateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

function cleanOptional(value?: string) {
  return value === "" ? null : value;
}

async function resolveUserId(request: Request, scope: string) {
  const apiUser = await getApiKeyUser(request, scope);

  if (apiUser) {
    return { userId: apiUser.id } as const;
  }

  const session = await auth();

  if (!session?.user?.id) {
    return { error: jsonError("Unauthorized", 401) } as const;
  }

  return { userId: session.user.id } as const;
}

export async function GET(request: NextRequest) {
  const resolved = await resolveUserId(request, "profile:read");

  if ("error" in resolved) {
    return resolved.error;
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: resolved.userId },
    include: { links: { orderBy: { position: "asc" } }, badges: { include: { badge: true } } }
  });

  return NextResponse.json({ profile });
}

export async function PATCH(request: NextRequest) {
  const resolved = await resolveUserId(request, "profile:write");

  if ("error" in resolved) {
    return resolved.error;
  }

  const parsed = await parseJson(request, profileUpdateSchema);

  if ("error" in parsed) {
    return parsed.error;
  }

  const data = parsed.data;
  const existing = await prisma.profile.findUnique({ where: { username: data.username } });

  if (existing && existing.userId !== resolved.userId) {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }

  const profile = await prisma.profile.upsert({
    where: { userId: resolved.userId },
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
      userId: resolved.userId,
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
