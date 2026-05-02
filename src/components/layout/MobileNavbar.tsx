"use client";

import { useState } from "react";
import { easeInOut, motion, MotionConfig } from "motion/react";
import { ThemeToggle } from "../theme/ThemeToggle";

export function MobileNavbar() {
  return (
    <div className="flex items-center gap-2 sm:hidden">
      <ThemeToggle />
      <AnimatedHamBurger />
    </div>
  );
}

function AnimatedHamBurger() {
  const [active, setActive] = useState(false);
  return (
    <MotionConfig transition={{ duration: 0.5, ease: easeInOut }}>
      <motion.button
        initial={false}
        animate={active ? "open" : "closed"}
        className="relative w-9 h-10"
        onClick={() => setActive((previous) => !previous)}
      >
        <motion.span
          className="absolute bg-black h-0.75 w-6"
          style={{ left: "50%", top: "35%", x: "-50%", y: "-50%" }}
          variants={{
            open: {
              rotate: ["0deg", "0deg", "45deg"],
              top: ["35%", "50%", "50%"],
            },
            closed: {
              rotate: ["45deg", "0deg", "0deg"],
              top: ["50%", "50%", "35%"],
            },
          }}
        />
        <motion.span
          className="absolute bg-black h-0.75 w-6"
          style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          variants={{
            open: { rotate: ["0deg", "0deg", "-45deg"] },
            closed: { rotate: ["-45deg", "0deg", "0deg"] },
          }}
        />
        <motion.span
          className="absolute bg-black h-0.75 w-6"
          style={{ left: "50%", bottom: "35%", x: "-50%", y: "50%" }}
          variants={{
            open: {
              rotate: ["0deg", "0deg", "45deg"],
              bottom: ["35%", "50%", "50%"],
            },
            closed: {
              rotate: ["45deg", "0deg", "0deg"],
              bottom: ["50%", "50%", "35%"],
            },
          }}
        />
      </motion.button>
    </MotionConfig>
  );
}
