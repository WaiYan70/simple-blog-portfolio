import { siGithub } from "simple-icons";
import { BrandIcon } from "@/components/shared/BrandIcon";
import { LinkedInIcon } from "@/components/icons/LinkedIn";

type SocialIconProps = {
  size?: number;
  className?: string;
};

export const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/WaiYan70",
    label: "GitHub",
    icon: (props: SocialIconProps) => (
      <BrandIcon path={siGithub.path} title="GitHub" {...props} />
    ),
    brandClassName: "bg-foreground text-background",
    hoverClassName: "hover:opacity-85",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/khant-wai-yan-00b1241b9/",
    label: "LinkedIn",
    icon: LinkedInIcon,
    brandClassName: "bg-[#0A66C2] text-white",
    hoverClassName: "hover:bg-[#084f96]",
  },
] as const;
