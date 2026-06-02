import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonError, parseJson, truncateHeader } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { viewCreateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`view:${ip}`, 30, 60_000);

  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = await parseJson(request, viewCreateSchema);

  if ("error" in parsed) {
    return parsed.error;
  }

  const data = parsed.data;
  const profile = await prisma.profile.findUnique({ where: { username: data.username } });

  if (!profile || !profile.isPublic) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const referrer = data.referrer || truncateHeader(request.headers.get("referer"), 512);
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  try {
    await prisma.profileView.create({
      data: {
        profileId: profile.id,
        ipHash,
        referrer,
        userAgent: truncateHeader(request.headers.get("user-agent"), 512),
        device: data.device || null
      }
    });
  } catch {
    return jsonError("Could not record view", 500);
  }

  return NextResponse.json({ ok: true });
}
