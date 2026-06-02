import crypto from "node:crypto";
import { prisma } from "@/lib/db";

export function createApiKeySecret() {
  const raw = `wee_${crypto.randomBytes(32).toString("base64url")}`;
  const prefix = raw.slice(0, 12);
  const keyHash = hashApiKey(raw);

  return { raw, prefix, keyHash };
}

export function hashApiKey(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function getApiKeyUser(request: Request, requiredScope?: string) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash: hashApiKey(token) },
    include: { user: true }
  });

  if (!apiKey || apiKey.revokedAt) {
    return null;
  }

  const scopes = apiKey.scopes.split(",");
  if (requiredScope && !scopes.includes(requiredScope)) {
    return null;
  }

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() }
  });

  return apiKey.user;
}
