import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getApiKeyUser } from "@/lib/api-auth";
import { linkUpdateSchema } from "@/lib/validators";

async function resolveUser(request: Request, scope: string) {
  const apiUser = await getApiKeyUser(request, scope);

  if (apiUser) {
    return apiUser.id;
  }

  const sessionUser = await requireUser();
  return sessionUser.id;
}

async function getOwnedLink(userId: string, id: string) {
  return prisma.link.findFirst({
    where: { id, profile: { userId } }
  });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const userId = await resolveUser(request, "links:write");
  const data = linkUpdateSchema.parse(await request.json());
  const link = await getOwnedLink(userId, params.id);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  const updated = await prisma.link.update({
    where: { id: params.id },
    data: {
      ...data,
      icon: data.icon === "" ? null : data.icon
    }
  });

  return NextResponse.json({ link: updated });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const userId = await resolveUser(request, "links:write");
  const link = await getOwnedLink(userId, params.id);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  await prisma.link.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
