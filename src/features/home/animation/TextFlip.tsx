"use client";

import { useEffect, useState } from "react";

const phrases = [
  "how they work",
  "how they scale",
  "their tradeoff",
  "architectures",
];

export function TextFlip() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2800); // slower = more professional

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
      <span
        key={phrases[index]}
        className="block sm:inline animate-textFlip wrap-break-word"
      >
        {phrases[index]}
      </span>
    </span>
  );
}
