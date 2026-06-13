import "server-only";
import { getCurrentSession } from "./session";
import { sql } from "@/db/client";

export interface CurrentUser {
  id: string;
  email: string;
  role: "admin";
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  const row = (await sql`
      select id, email, role from users where id = ${session.userId} limit 1
    `) as CurrentUser[];

  return row[0] ?? null;
}
