import Link from "next/link";
import { siGithub } from "simple-icons/icons";
import { BrandIcon } from "../shared/BrandIcon";
import { LinkedInIcon } from "../icons/LinkedIn";

const navItem = [
  { href: "/blog", label: "Blogs" },
  { href: "/projects", label: "Projects" },
];

const socialLinks = [
  { href: "https://github.com/WaiYan70", label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/khant-wai-yan-00b1241b9/",
    label: "Linkedln",
  },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          Khant.dev
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex gap-4 font-semibold text-sm text-muted-foreground">
            {navItem.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div>|</div>
          <div className="flex gap-4">
            <Link
              href="https://github.com/WaiYan70"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground transition hover:text-foreground"
            >
              <BrandIcon path={siGithub.path} title="GitHub" />
            </Link>

            <Link
              href="https://www.linkedin.com/in/khant-wai-yan-00b1241b9/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground transition hover:text-foreground"
            >
              <LinkedInIcon />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
