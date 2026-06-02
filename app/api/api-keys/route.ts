import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { apiKeyCreateSchema } from "@/lib/validators";
import { createApiKeySecret } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireUser();
  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      label: true,
      prefix: true,
      scopes: true,
      lastUsedAt: true,
      revokedAt: true,
      createdAt: true
    }
  });

  return NextResponse.json({ apiKeys });
}

export async function POST(request: Request) {
  const user = await requireUser();
  const data = apiKeyCreateSchema.parse(await request.json());
  const secret = createApiKeySecret();
  const apiKey = await prisma.apiKey.create({
    data: {
      userId: user.id,
      label: data.label,
      scopes: data.scopes.join(","),
      prefix: secret.prefix,
      keyHash: secret.keyHash
    },
    select: {
      id: true,
      label: true,
      prefix: true,
      scopes: true,
      createdAt: true
    }
  });

  return NextResponse.json({ apiKey, token: secret.raw }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await requireUser();
  const { id } = (await request.json()) as { id?: string };

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const apiKey = await prisma.apiKey.findFirst({ where: { id, userId: user.id } });

  if (!apiKey) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  await prisma.apiKey.update({ where: { id }, data: { revokedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
