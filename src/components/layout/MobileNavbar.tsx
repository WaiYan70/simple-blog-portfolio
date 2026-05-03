"use client";

import { useId, useState } from "react";
import { AnimatePresence, easeInOut, motion, MotionConfig } from "motion/react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { navbarLinks } from "./NavbarLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuSlide = {
  initial: { x: "100%" },
  enter: {
    x: 0,
    transition: { duration: 0.75, ease: easeInOut },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.55, ease: easeInOut },
  },
};

export function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  return (
    <div className="flex items-center gap-2 sm:hidden">
      <ThemeToggle />
      <AnimatedHamBurger
        active={open}
        controls={menuId}
        onToggle={() => setOpen((previous) => !previous)}
      />
      <AnimatePresence mode="wait">
        {open && <MobileMenu id={menuId} onNavigate={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

type AnimatedHamBurgerProps = {
  active: boolean;
  controls: string;
  onToggle: () => void;
};

function AnimatedHamBurger({
  active,
  controls,
  onToggle,
}: AnimatedHamBurgerProps) {
  return (
    <MotionConfig transition={{ duration: 0.5, ease: easeInOut }}>
      <motion.button
        type="button"
        initial={false}
        animate={active ? "open" : "closed"}
        aria-controls={controls}
        aria-expanded={active}
        className="relative w-9 h-9 z-70 bg-primary/20 rounded-sm"
        onClick={onToggle}
      >
        <motion.span
          className="absolute bg-black h-0.5 w-5"
          style={{ left: "calc(50% + 2px)", top: "35%", x: "-50%", y: "-50%" }}
          variants={{
            open: {
              rotate: ["0deg", "0deg", "45deg"],
              top: ["35%", "50%", "50%"],
              left: "50%",
              width: "24px",
            },
            closed: {
              rotate: ["45deg", "0deg", "0deg"],
              top: ["50%", "50%", "35%"],
              left: "calc(50% + 2px)",
              width: "20px",
            },
          }}
        />
        <motion.span
          className="absolute bg-black h-0.5 w-6"
          style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          variants={{
            open: { rotate: ["0deg", "0deg", "-45deg"] },
            closed: { rotate: ["-45deg", "0deg", "0deg"] },
          }}
        />
        <motion.span
          className="absolute bg-black h-0.5 w-4"
          style={{
            left: "calc(50% + 4px)",
            bottom: "35%",
            x: "-50%",
            y: "50%",
          }}
          variants={{
            open: {
              rotate: ["0deg", "0deg", "45deg"],
              bottom: ["35%", "50%", "50%"],
              left: "50%",
            },
            closed: {
              rotate: ["45deg", "0deg", "0deg"],
              bottom: ["50%", "50%", "35%"],
              left: "calc(50% + 4px)",
            },
          }}
        />
      </motion.button>
    </MotionConfig>
  );
}

type MobileMenuProps = {
  id: string;
  onNavigate: () => void;
};

function MobileMenu({ id, onNavigate }: MobileMenuProps) {
  const pathname = usePathname();
  return (
    <motion.nav
      id={id}
      aria-label="Mobile navigation"
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="fixed inset-0 z-60 flex min-h-dvh flex-col justify-between overflow-hidden bg-background px-6 pb-8 pt-24 text-foreground shadow-2xl"
    >
      <div
        aria-hidden="true"
        className="absolute -left-20 top-0 h-full w-24 rounded-r-[100%] bg-background shadow-[-24px_0_60px_rgba(0,0,0,0.18)]"
      >
        <div className="relative z-10">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Navigation
          </p>
          <ul>
            {navbarLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className={`block rounded-2xl px-4 py-4 text-3xl font-semibold tracking-tight transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}
