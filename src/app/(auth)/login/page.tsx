import { getCurrentUser } from "@/lib/auth/user";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main>
      <section>
        <h1>Admin Sign In</h1>
        <p>Enter your admin credentials </p>
      </section>
    </main>
  );
}
