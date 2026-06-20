import "server-only";
import { sql } from "../client";

export interface Session {
  id: string;
  userId: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  expiresAt: Date;
}

interface SessionRow {
  id: string;
  userId: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  expiresAt: string;
}

export interface CreateSessionRecordInput {
  id: string;
  userId: string;
  sessionTokenHash: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  expiresAt: Date;
}

export interface CreateSessionRecordResult {
  session: Session;
  replacedExistingSession: boolean;
}

function mapSessionRow(row: SessionRow): Session {
  return {
    id: row.id,
    userId: row.userId,
    userAgent: row.userAgent,
    ipAddress: row.ipAddress,
    createdAt: new Date(row.createdAt),
    expiresAt: new Date(row.expiresAt),
  };
}

export async function createSessionRecord(
  input: CreateSessionRecordInput,
): Promise<CreateSessionRecordResult> {
  const result = await sql.transaction(
    (transaction) => [
      transaction`
        select exists(
          select 1
          from sessions
          where user_id = ${input.userId}
            and expires_at > now()
        ) as "exists"
      `,
      transaction`
        delete from sessions
        where user_id = ${input.userId}
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
          ${input.sessionId},
          ${input.userId},
          ${input.sessionTokenHash},
          ${input.userAgent ?? null},
          ${input.ipAddress ?? null},
          ${input.expiresAt}
        )
        returning
          id,
          user_id as "userId",
          user_agent as "userAgent",
          ip_address as "ipAddress",
          created_at as "createdAt",
          expires_at as "expiresAt"
      `,
    ],
    {
      isolationLevel: "Serializable",
    },
  );

  const existingRows = result[0] as Array<{ exists: boolean }>;
  const insertedRows = result[2] as SessionRow[];
  const insertedSession = insertedRows[0];

  if (!insertedSession) {
    throw new Error("Failed to create session");
  }

  return {
    session: mapSessionRow(insertedSession),
    replacedExistingSession: existingRows[0]?.exists === true,
  };
}

export async function findActionSessionByTokenHash(
  sessionTokenHash: string,
): Promise<Session | null> {
  const result = (await sql`
      select
        id,
        user_id as "userId",
        user_agent as "userAgent",
        ip_address as "ipAddress",
        created_at as "createdAt",
        expires_at as "expiresAt"
      from sessions
      where session_token_hash = ${sessionTokenHash}
       and expires_at > now()
       limit 1
      `) as SessionRow[];

  if (!result) {
    return null;
  }

  return result[0];
}

export async function deleteSessionByTokenHash(
  sessionTokenHash: string,
): Promise<void> {
  const result = await sql`
    delete from sessions
    where session_token_hash = ${sessionTokenHash}
  `;
  return result;
}
