import "server-only";
import {
  deleteLoginAttempt,
  findLoginAttemptLock,
  recordFailedLoginAttempt,
} from "@/db/repositories/login-attempt-repository";
import { createHash } from "node:crypto";

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

  const attempt = await findLoginAttemptLock(identifierHash);

  if (!attempt?.lockedUntil) return true;

  return new Date(attempt.lockedUntil) <= new Date();
}

export async function recordFailedLogin(
  email: string,
  ipAddress: string | null,
): Promise<void> {
  const identifierHash = hashIdentifier(email, ipAddress);
  const lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);

  await recordFailedLoginAttempt(
    identifierHash,
    lockedUntil,
    MAX_FAILED_ATTEMPTS,
  );
}

export async function clearFailedLogins(
  email: string,
  ipAddress: string | null,
): Promise<void> {
  const identifierHash = hashIdentifier(email, ipAddress);

  await deleteLoginAttempt(identifierHash);
}
