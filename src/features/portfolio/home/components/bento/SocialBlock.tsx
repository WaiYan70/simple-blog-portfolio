import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { MapPin } from "lucide-react";
import { siGithub } from "simple-icons";
import { Block } from "./Block";
import { BangkokClock } from "./BangkokClock";
import { LinkedInIcon } from "@/components/icons/LinkedIn";
import { BrandIcon } from "@/components/shared/BrandIcon";

const socialCardClassName =
  "col-span-3 md:col-span-2 grid place-items-center p-0";

const socialLinkClassName =
  "grid h-full w-full place-content-center rounded-2xl transition-colors duration-300";

const socialIconClassName = "h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7";

export function SocialBlock() {
  return (
    <>
      <Block
        whileHover={{ y: -3, rotate: "2.5deg" }}
        className="col-span-6 md:col-span-4 flex flex-col items-center justify-center bg-muted/40 text-foreground"
      >
        <div className="flex items-center justify-center gap-1.5 text-center">
          <MapPin className={twMerge(socialIconClassName, "text-primary")} />
          <p className="inline text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Asia / Bangkok
          </p>
        </div>
        <BangkokClock />
      </Block>

      <Block
        whileHover={{ y: -3, rotate: "2.5deg" }}
        className={twMerge(
          socialCardClassName,
          "bg-foreground text-background",
        )}
      >
        <Link
          href="https://github.com/WaiYan70"
          className={twMerge(socialLinkClassName, "hover:opacity-85")}
        >
          <BrandIcon
            path={siGithub.path}
            title="Github"
            className={socialIconClassName}
          />
        </Link>
      </Block>

      <Block
        whileHover={{ y: -3, rotate: "-2.5deg" }}
        className={twMerge(socialCardClassName, "bg-[#0A66C2] text-white")}
      >
        <Link
          href="https://www.linkedin.com/in/khant-wai-yan-00b1241b9/"
          className={twMerge(socialLinkClassName, "hover:bg-[#084f96]")}
        >
          <LinkedInIcon className={socialIconClassName} />
        </Link>
      </Block>
    </>
  );
}
