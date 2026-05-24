import Image from "next/image";
import Link from "next/link";
import { TextFlip } from "../../animation/TextFlip";
import { ArrowRight } from "lucide-react";
import { Block } from "./Block";

export function HeaderBlock() {
  return (
    <Block className="col-span-12 md:col-span-8 row-span-2 flex flex-col justify-between bg-linear-to-br from-card via-card to-muted/50 md:p-7">
      <div className="flex justify-start items-center gap-3">
        <Image
          width={56}
          height={56}
          src="/profile.jpeg"
          alt="avatar"
          className="size-14 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-primary">
            Hi, I’m Khant Wai Yan
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Software Engineer
          </p>
        </div>
      </div>

      {/* Main headline */}
      <h1 className="mt-5 max-w-2xl text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight tracking-tight ">
        Building systems that explain{" "}
        <span className="text-primary">
          <TextFlip />
        </span>{" "}
        — not just what they do.
      </h1>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/blog"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-dark"
        >
          Read Blog
        </Link>

        <Link
          href="/projects"
          className="text-sm font-medium text-muted-foreground transition hover:text-primary group inline-flex items-center gap-1.5"
        >
          View Projects
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Block>
  );
}
