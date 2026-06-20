"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/auth/session";
import z from "zod";
import { verifyPassword } from "@/lib/auth/password";
import {
  clearFailedLogins,
  isLoginAllowed,
  recordFailedLogin,
} from "@/lib/auth/login-rate-limit";
import { findAdminCredentialsByEmails } from "@/db/repositories/user-repository";

export interface LoginState {
  error: string | null;
}

const loginSchema = z.object({
  email: z.string().trim().lowercase().max(254).pipe(z.email()),
  password: z.string().min(1).max(256),
});

async function getRequestMetadata() {
  const headerStore = await headers();

  const userAgent = headerStore.get("user-agent")?.slice(0, 500) ?? null;
  const forwardFor = headerStore.get("x-forwarded-for");
  const ipAddress = forwardFor?.split(",")[0]?.trim().slice(0, 64) ?? null;

  return { userAgent, ipAddress };
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const metaData = await getRequestMetadata();

  // Validation
  const validationResult = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // if !Validation
  if (!validationResult.success) {
    return { error: "Enter a valid email and password" };
  }

  const { email, password } = validationResult.data;

  const allowed = await isLoginAllowed(email, metaData.ipAddress);
  if (!allowed) {
    return {
      error: "Too many failed login attempts. Please try again later.",
    };
  }

  let replacedExistingSession = false;

  try {
    // get the first user
    const user = await findAdminCredentialsByEmails(email);

    // valdie the user
    if (!user || user.role !== "admin") {
      await recordFailedLogin(email, metaData.ipAddress);
      return { error: "Invalid Email and Password" };
    }

    const passwordIsValid = await verifyPassword(password, user.passwordHash);

    if (!passwordIsValid) {
      await recordFailedLogin(email, metaData.ipAddress);
      return { error: "Invalid Email and Password" };
    }

    await clearFailedLogins(email, metaData.ipAddress);
    const result = await createSession(user.id, metaData);

    replacedExistingSession = result.replacedExistingSession;
  } catch {
    return { error: "Unable to sign in right now. Please try again" };
  }

  redirect(replacedExistingSession ? "/admin?session=replaced" : "/admin");
}

export async function logoutAction(): Promise<never> {
  await deleteSession();
  redirect("/login");
}
