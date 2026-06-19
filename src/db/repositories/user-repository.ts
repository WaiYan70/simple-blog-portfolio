import "server-only";
import { sql } from "../client";

export interface CurrentUser {
  id: string;
  email: string;
  role: "admin";
}

export interface AdminCredentials {
  id: string;
  email: string;
  passwordHash: string;
  role: "admin";
}

export async function findCurrentUserById(
  userId: string,
): Promise<CurrentUser | null> {
  const rows = (await sql`
      select
          id,
          email,
          role
      from users
      where id=${userId}
      limit 1
    `) as CurrentUser[];

  return rows[0] ?? null;
}

export async function findAdminCredentialsByEmails(
  email: string,
): Promise<AdminCredentials | null> {
  const rows = (await sql`
      select
        id,
        email,
        password_hash as "passwordHash",
        role
      from users
      where email=${email}
      limit 1
    `) as AdminCredentials[];

  return rows[0] ?? null;
}
