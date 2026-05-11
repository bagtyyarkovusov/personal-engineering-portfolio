import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";

const TOKEN_BYTES = 32;

export function generateToken(): { raw: string; hash: string } {
  const raw = crypto.randomBytes(TOKEN_BYTES).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export async function validateToken(hash: string) {
  const token = await prisma.accessToken.findUnique({
    where: { tokenHash: hash },
    include: { room: true },
  });

  if (!token) return null;
  if (token.revokedAt) return null;
  if (token.expiresAt && token.expiresAt < new Date()) return null;

  await prisma.accessToken.update({
    where: { id: token.id },
    data: { lastUsedAt: new Date() },
  });

  return token;
}

export async function revokeToken(hash: string) {
  const token = await prisma.accessToken.findUnique({
    where: { tokenHash: hash },
  });

  if (!token || token.revokedAt) return null;

  return prisma.accessToken.update({
    where: { id: token.id },
    data: { revokedAt: new Date() },
  });
}
