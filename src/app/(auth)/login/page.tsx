import { getCurrentUser } from "@/lib/auth/user";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground"> </p>
        <LoginForm />
      </section>
    </main>
  );
}
