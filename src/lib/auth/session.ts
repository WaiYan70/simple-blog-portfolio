import { sql } from "@/db/client";
import { cookies } from "next/headers";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import "server-only";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

interface Session {
  id: string;
  userId: string;
  userAgent: string | null;
  ipAddress: string | null;
  createAt: Date;
  expiresAt: Date;
}

interface SessionRow {
  id: string;
  userId: string;
  userAgent: string | null;
  ipAddress: string | null;
  createAt: string;
  expiresAt: string;
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

function mapSessionRow(row: SessionRow): Session {
  return {
    id: row.id,
    userId: row.userId,
    userAgent: row.userAgent,
    ipAddress: row.ipAddress,
    createAt: new Date(row.createAt),
    expiresAt: new Date(row.expiresAt),
  };
}

export async function createSession(
  userId: string,
  metadata: SessionMetaData = {},
): Promise<CreateSessionResult> {
  const sessionId = randomUUID();
  const sessionToken = generateSessionToken();
  const sessionTokenHash = hashSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const results = await sql.transaction(
    (transaction) => [
      transaction`
        select exists(
          select 1
          from sessions
          where user_id = ${userId}
            and expires_at > now()
        ) as "exists"
      `,
      transaction`
        delete from sessions
        where user_id = ${userId}
      `,
      transaction`
        insert into sessions (
          id,
          user_id,
          session_token_hash,
          user_agent,
          ip_address,
          expires_at
        )
        values (
          ${sessionId},
          ${userId},
          ${sessionTokenHash},
          ${metadata.userAgent ?? null},
          ${metadata.ipAddress ?? null},
          ${expiresAt}
        )
      `,
    ],
    {
      isolationLevel: "Serializable",
    },
  );

  const existingRows = results[0] as Array<{ exists: boolean }>;
  const insertedRows = results[2] as SessionRow[];
  const insertedSession = insertedRows[0];

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return {
    session: mapSessionRow(insertedSession),
    replacedExistingSession: existingRows[0]?.exists === true,
  };
}

export async function getCurrentSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const sessionTokenHash = hashSessionToken(sessionToken);

  const rows = (await sql`
      select
        id,
        user_id as "userId",
        user_agent as "userAgent",
        ip_address as "ipAddress",
        create_at as "createAt",
        expires_at as "expiresAt"
      from sessions
      where session_token_hash = ${sessionTokenHash}
      `) as SessionRow[];

  const session = rows[0];

  if (!session) {
    return null;
  }

  return mapSessionRow(session);
}
