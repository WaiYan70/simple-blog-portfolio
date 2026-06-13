import "server-only";

import { redirect } from "next/navigation";
import { type CurrentUser, getCurrentUser } from "./user";

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  return user;
}
