import "server-only";
import { sql } from "../client";

export interface LoginAttemptLock {
  lockedUntil: string | null;
}

export async function findLoginAttemptLock(
  identifierHash: string,
): Promise<LoginAttemptLock | null> {
  const rows = (await sql`
      select locked_until as "lockedUntil"
      from login_attempts
      where identifier_hash = ${identifierHash}
      limit 1
    `) as LoginAttemptLock[];

  return rows[0] ?? null;
}

export async function recordFailedLoginAttempt(
  identifierHash: string,
  lockedUntil: Date,
  maxFailedAttempts: number,
): Promise<void> {
  await sql`
    insert into login_attempts(
        identifier_hash,
        failed_attempt_count,
        first_failed_at,
        last_failed_at,
        locked_until
    )
    values(
        ${identifierHash},
        1,
        now(),
        now(),
        null
    )
    on conflict (identifier_hash)
    do update set
        failed_attempt_count = case
            when login_attempts.locked_until is not null
              and login_attempts.locked_until <= now()
            then 1
            else login_attempts.failed_attempt_count + 1
        end,
        last_failed_at = now(),
        locked_until = case
            when login_attempts.locked_until is not null
              and login_attempts.locked_until <= now()
            then null
            when login_attempts.failed_attempt_count + 1 >= ${maxFailedAttempts}
            then ${lockedUntil}
            else login_attempts.locked_until
        end
    `;
}

export async function deleteLoginAttempt(
  identifierHash: string,
): Promise<void> {
  await sql`
        delete from login_attempts
        where identifier_hash = ${identifierHash}
    `;
}
