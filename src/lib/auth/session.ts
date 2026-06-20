import "server-only";
import { cookies } from "next/headers";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import {
  createSessionRecord,
  deleteSessionByTokenHash,
  findActiveSessionByTokenHash,
} from "@/db/repositories/session-repository";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

interface Session {
  id: string;
  userId: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  expiresAt: Date;
}

interface SessionMetaData {
  userAgent?: string | null;
  ipAddress?: string | null;
}

interface CreateSessionResult {
  session: Session;
  replacedExistingSession: boolean;
}

function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  userId: string,
  metadata: SessionMetaData = {},
): Promise<CreateSessionResult> {
  const sessionId = randomUUID();
  const sessionToken = generateSessionToken();
  const sessionTokenHash = hashSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const result = await createSessionRecord({
    id: sessionId,
    userId,
    sessionTokenHash,
    userAgent: metadata.userAgent ?? null,
    ipAddress: metadata.ipAddress ?? null,
    expiresAt,
  });

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return result;
}

export async function getCurrentSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const sessionTokenHash = hashSessionToken(sessionToken);

  return findActiveSessionByTokenHash(sessionTokenHash);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    const sessionTokenHash = hashSessionToken(sessionToken);

    await deleteSessionByTokenHash(sessionTokenHash);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
