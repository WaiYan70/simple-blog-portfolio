import "server-only";
import { getCurrentSession } from "./session";
import {
  type CurrentUser,
  findCurrentUserById,
} from "@/db/repositories/user-repository";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return findCurrentUserById(session.id);
}
