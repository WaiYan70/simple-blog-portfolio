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

const top = {
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
};

const middle = {
  open: { rotate: ["0deg", "0deg", "-45deg"] },
  closed: { rotate: ["-45deg", "0deg", "0deg"] },
};

const bottom = {
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
};

export function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  return (
    <div className="relative flex items-center gap-2 sm:hidden">
      <div className="relative z-70 flex items-center gap-2">
        <ThemeToggle />
        <AnimatedHamBurger
          active={open}
          controls={menuId}
          onToggle={() => setOpen((previous) => !previous)}
        />
      </div>
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
        aria-label={active ? "Close navigation menu" : "Open navigation menu"}
        className="relative h-9 w-9 rounded-md border  text-foreground transition-colors border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
        onClick={onToggle}
      >
        <motion.span
          className="absolute h-0.5 w-5 rounded-full bg-current"
          style={{ left: "calc(50% + 2px)", top: "35%", x: "-50%", y: "-50%" }}
          variants={top}
        />
        <motion.span
          className="absolute h-0.5 w-6 rounded-full bg-current"
          style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          variants={middle}
        />
        <motion.span
          className="absolute h-0.5 w-4 rounded-full bg-current"
          style={{
            left: "calc(50% + 4px)",
            bottom: "35%",
            x: "-50%",
            y: "50%",
          }}
          variants={bottom}
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
            const Icon = link.icon;
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
                  <span className="inline-flex items-center gap-3">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                    {link.name}
                  </span>
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
