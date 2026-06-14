"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/auth/session";
import z from "zod";
import { sql } from "@/db/client";
import { verifyPassword } from "@/lib/auth/password";

export interface LoginState {
  error: string | null;
}

interface AdminCredentialsRow {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
}

const loginSchema = z.object({
  email: z.string().trim().lowercase().max(254).pipe(z.email()),
  password: z.string().min(1).max(256),
});

async function getRequestMetadata() {
  const headerStore = await headers();

  const userAgent = headerStore.get("user-agent")?.slice(0, 500) ?? null;
  const forwardFor = headerStore.get("x-forwarded-for");
  const ipAddess = forwardFor?.split(",")[0]?.trim().slice(0, 64) ?? null;

  return { userAgent, ipAddess };
}

export async function loginInAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  // Validation
  const validationResult = loginSchema.safeParse({
    email: formData.get("email"),
    PassThrough: formData.get("password"),
  });

  // if !Validation
  if (!validationResult.success) {
    return { error: "Enter a valid email and password" };
  }

  const { email, password } = validationResult.data;
  let replaceExisitngSession = false;

  try {
    // run the query to find the admin email
    const rows = (await sql`
        select
          id,
          email,
          passward_hash as "passwordHash",
          role
        from users
        where email = ${email}
        limit 1
      `) as AdminCredentialsRow[];
    // get the first user
    const user = rows[0];

    // valdie the user
    if (!user || user.role) {
      return { error: "Invalid Email" };
    }

    const passwordIsValid = await verifyPassword(password, user.passwordHash);

    if (!passwordIsValid) {
      return { error: "Invalide Password" };
    }

    const metaData = await getRequestMetadata();
    const result = await createSession(user.id, metaData);

    replaceExisitngSession = result.replacedExistingSession;
  } catch {
    return { error: "Unable to sign in right now. Please try again" };
  }

  redirect(replaceExisitngSession ? "/admin?session=replaced" : "/admin");
}

export async function logoutAction(): Promise<never> {
  await deleteSession();
  redirect("/login");
}
