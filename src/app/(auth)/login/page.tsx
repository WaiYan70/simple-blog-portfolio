import { getCurrentUser } from "@/lib/auth/user";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import Image from "next/image";
import { Feather } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="font-mono min-[900px]:grid min-[900px]:grid-cols-2 min-h-svh bg-background">
      {/* Image section*/}
      <section className="relative hidden min-h-svh overflow-hidden min-[900px]:flex min-[900px]:flex-col min-[900px]:justify-between">
        <Image
          src="/profile/clear-sky.png"
          alt="a person overlooking green mountain farms beneath a blue sky"
          fill
          priority
          sizes="(min-width: 900px) 50vw, 100vw"
          loading="eager"
          className="object-cover object-[center_90%]"
        />
        {/* Welcome Text */}
        <div className="relative mt-[6.7vh] ml-[8.9%]">
          <h2 className="font-[750] text-black text-2xl text-[clamp(2rem, 2.65vw, 2.875rem)] leading-[1.1] tracking-[-0.035em]">
            Welcome Back!
          </h2>
          <p className="font-medium text-black/80 mt-[1.6rem] text-[clamp(1rem,1.42vw,1.5rem)] leading-[1.55] tracking-[-0.012em]">
            Access your dashboard to <br /> manage your blog and portfolio
          </p>
        </div>
        {/* Quote what are you doing*/}
        <div className="relative mb-[6.7vh] ml-[8.9%]">
          <span
            className="grid size-15 place-items-center rounded-full bg-white text-primary-dark shadow-accent"
            aria-hidden="true"
          >
            <Feather />
          </span>
          <p className="font-medium mt-5 text-[clamp(1rem,1.25vw,1.25rem)] leading-normal text-white [text-shadow:0_1px_8px_rgb(0_0_0/30%)]">
            Share your ideas.
            <br />
            Inspire the world.
          </p>
        </div>
      </section>

      {/* Login Form*/}
      <section className="relative flex min-h-svh items-center justify-center bg-background px-5 pt-14 pb-10  min-[521px]:p-12 min-[521px]:px-6 min-[900px]:px-[clamp(3rem,5.65vw,6.2rem)] min-[900px]:py-25">
        <div className="absolute top-12 right-12 min-[521px]:top-20 min-[521px]:right-20">
          <ThemeToggle
            className="size-16 rounded-full border-dashed"
            iconClassName="size-6"
          />
        </div>

        <div className="w-full max-w-md min-[900px]:max-w-lg">
          <h1 className="text-[1rem] leading-[1.15] font-[750] tracking-[-0.04em] text-primary min-[521px]:text-[clamp(1rem,1vw,1.5rem)]">
            Blog-Based Portfolio
          </h1>
          <h2 className="mt-2 text-[2rem] leading-[1.15] font-[750] tracking-[-0.04em] text-primary min-[521px]:text-[clamp(2rem,2.3vw,2.5rem)]">
            Admin Login
          </h2>
          <p className="mt-2 text-[clamp(1rem,1.35vw,1.375rem)] leading-normal text-[#64708a]">
            Sign in to continue your journey
          </p>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
