import "server-only";
import { argon2id, hash, verify, type Options } from "argon2";

const PASSWORD_HASH_OPTIONS = {
  type: argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
} satisfies Options;

export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password is missing!");
  }

  return hash(password, PASSWORD_HASH_OPTIONS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  if (!password || !passwordHash) {
    return false;
  }

  try {
    return verify(passwordHash, password);
  } catch {
    return false;
  }
}
