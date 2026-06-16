import { sql } from "@/db/client";
import { createHash } from "node:crypto";
import "server-only";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

function hashIdentifier(email: string, ipAddress: string | null): string {
  const value = `${email}:${ipAddress ?? null}`;
  return createHash("sha256").update(value).digest("hex");
}

export async function isLoginAllowed(
  email: string,
  ipAddress: string | null,
): Promise<boolean> {
  const identifierHash = hashIdentifier(email, ipAddress);

  const rows = (await sql`
      select locked_until as "lockedUntil"
      from login_attempts
      where identifier_hash = ${identifierHash}
      limit 1
    `) as Array<{ lockedUntil: string | null }>;

  const attempt = rows[0];

  if (!attempt?.lockedUntil) return true;

  return new Date(attempt.lockedUntil) <= new Date();
}

export async function recordFailedLogin(
  email: string,
  ipAddress: string | null,
) {
  const identifierHash = hashIdentifier(email, ipAddress);
  const lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);

  await sql`
    insert into login_attempts(
        identifier_hash,
        failed_attempt_count,
        first_failed_at,
        last_failed_at,
        locked_until
    )
    values(
        ${identifierHash}
        1,
        now(),
        now(),
        null
    )
    on conflict (identifier_hash)
    do update set
        failed_attempt_count = login_attempts.failed_attempt_count + 1
        last_failed_at = now(),
        locked_until = case
            when login_attempts.failed_attempt_count + 1 >= ${MAX_FAILED_ATTEMPTS}
            then ${lockedUntil}
            else login_attempts.locked_until
        end
    `;
}

export async function clearFailedLogins(
  email: string,
  ipAddress: string | null,
): Promise<void> {
  const identifierHash = hashIdentifier(email, ipAddress);

  await sql`
        delete from login_attempts
        where identifierHash = ${identifierHash}
    `;
}
