import Link from "next/link";
import { Computer } from "lucide-react";

const navItem = [
  { href: "/blog", label: "Blogs" },
  { href: "/project", label: "Projects" },
];

const socialLinks = [
  { href: "https://github.com/WaiYan70", label: "GitHub" },
  { href: "https://github.com/WaiYan70", label: "GitHub" },
];

const Navbar = () => {
  return (
    <header className="flex flex-col items-center justify-center">
      <nav className="flex justify-between w-full max-w-3xl px-4 py-3">
        <div>
          <Link href="/" className="font-bold">
            KWY
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4 font-semibold text-sm">
            {navItem.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>|</div>
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Computer size={16} />
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
