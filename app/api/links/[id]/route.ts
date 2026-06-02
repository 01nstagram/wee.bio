import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getApiKeyUser } from "@/lib/api-auth";
import { jsonError, parseJson } from "@/lib/api-response";
import { linkUpdateSchema } from "@/lib/validators";

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

async function getOwnedLink(userId: string, id: string) {
  return prisma.link.findFirst({
    where: { id, profile: { userId } }
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const resolved = await resolveUser(request, "links:write");

  if ("error" in resolved) {
    return resolved.error;
  }

  const parsed = await parseJson(request, linkUpdateSchema);

  if ("error" in parsed) {
    return parsed.error;
  }

  const link = await getOwnedLink(resolved.userId, params.id);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  const updated = await prisma.link.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      icon: parsed.data.icon === "" ? null : parsed.data.icon
    }
  });

  return NextResponse.json({ link: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const resolved = await resolveUser(request, "links:write");

  if ("error" in resolved) {
    return resolved.error;
  }

  const link = await getOwnedLink(resolved.userId, params.id);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  await prisma.link.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
