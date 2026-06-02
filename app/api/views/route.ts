import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { viewCreateSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`view:${ip}`, 30, 60_000);

  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const data = viewCreateSchema.parse(await request.json());
  const profile = await prisma.profile.findUnique({ where: { username: data.username } });

  if (!profile || !profile.isPublic) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
  await prisma.profileView.create({
    data: {
      profileId: profile.id,
      ipHash,
      referrer: data.referrer || request.headers.get("referer"),
      userAgent: request.headers.get("user-agent"),
      device: data.device || null
    }
  });

  return NextResponse.json({ ok: true });
}
