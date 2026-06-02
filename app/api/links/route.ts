import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getApiKeyUser } from "@/lib/api-auth";
import { jsonError, parseJson } from "@/lib/api-response";
import { linkCreateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

async function resolveUser(request: Request, scope: string) {
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
  const resolved = await resolveUser(request, "links:read");

  if ("error" in resolved) {
    return resolved.error;
  }

  const profile = await prisma.profile.findUnique({ where: { userId: resolved.userId } });

  if (!profile) {
    return NextResponse.json({ links: [] });
  }

  const links = await prisma.link.findMany({
    where: { profileId: profile.id },
    orderBy: { position: "asc" }
  });

  return NextResponse.json({ links });
}

export async function POST(request: NextRequest) {
  const resolved = await resolveUser(request, "links:write");

  if ("error" in resolved) {
    return resolved.error;
  }

  const parsed = await parseJson(request, linkCreateSchema);

  if ("error" in parsed) {
    return parsed.error;
  }

  const profile = await prisma.profile.findUnique({ where: { userId: resolved.userId } });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const link = await prisma.link.create({
    data: {
      ...parsed.data,
      icon: parsed.data.icon || null,
      profileId: profile.id
    }
  });

  return NextResponse.json({ link }, { status: 201 });
}
