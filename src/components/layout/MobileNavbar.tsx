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
    transition: { duration: 0.68, ease: easeInOut },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.5, ease: easeInOut },
  },
};

const mobileLinkSlide = {
  initial: { x: 48, opacity: 0 },
  enter: (index: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.18 + 0.07 * index,
      duration: 0.5,
      ease: easeInOut,
    },
  }),
  exit: (index: number) => ({
    x: 48,
    opacity: 0,
    transition: {
      delay: 0.03 * index,
      duration: 0.28,
      ease: easeInOut,
    },
  }),
};

const curvePath = {
  initial: {
    d: "M100 0 L100 100 Q-100 50 100 0",
  },
  enter: {
    d: "M100 0 L100 100 Q100 50 100 0",
    transition: { duration: 0.68, ease: easeInOut },
  },
  exit: {
    d: "M100 0 L100 100 Q-100 50 100 0",
    transition: { duration: 0.5, ease: easeInOut },
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
    <MotionConfig transition={{ duration: 0.42, ease: easeInOut }}>
      <motion.button
        type="button"
        initial={false}
        animate={active ? "open" : "closed"}
        aria-controls={controls}
        aria-expanded={active}
        className="relative z-70 h-9 w-9 rounded-md border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted"
        onClick={onToggle}
      >
        <motion.span
          className="absolute h-0.5 w-5 rounded-full bg-current"
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
          className="absolute h-0.5 w-6 rounded-full bg-current"
          style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          variants={{
            open: { rotate: ["0deg", "0deg", "-45deg"] },
            closed: { rotate: ["-45deg", "0deg", "0deg"] },
          }}
        />
        <motion.span
          className="absolute h-0.5 w-4 rounded-full bg-current"
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
      className="fixed inset-0 z-60 flex min-h-dvh flex-col justify-between overflow-visible border-l border-border bg-card px-6 pb-8 pt-24 text-card-foreground shadow-2xl"
    >
      <MenuCurve />
      <div className="relative z-10">
        <p className="mb-8 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Navigation
        </p>
        <ul className="space-y-3">
          {navbarLinks.map((link, index) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <motion.li
                key={link.href}
                custom={index}
                variants={mobileLinkSlide}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className={`block rounded-2xl p-4 text-3xl font-semibold tracking-tight transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-card-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <p className="relative z-10 text-sm leading-6 text-muted-foreground">
        Software engineer portfolio documenting projects, writing, and system
        design decisions.
      </p>
    </motion.nav>
  );
}

function MenuCurve() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -left-25 top-0 h-full w-25 fill-card"
    >
      <motion.path
        variants={curvePath}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
}
