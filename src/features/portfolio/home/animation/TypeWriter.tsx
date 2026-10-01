"use client";

import { useEffect, useState } from "react";

export function TypeWriter({
  text,
  speed = 30,
  startDelay = 500,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;

    const delay = setTimeout(() => {
      setTyping(true);

      const interval = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setTyping(false);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);

  return (
    <span className="wrap-break-word">
      {/* BEFORE typing → blinking */}
      {!typing && !done && (
        <span className="mr-1 animate-caret-blink text-muted-foreground">
          _
        </span>
      )}
      {/* Typed text */}
      {displayed}
      {/* DURING typing → solid caret (no blink) */}
      {typing && <span className="ml-1 text-muted-foreground">_</span>}
      {/* AFTER typing → blinking caret */}
      {done && (
        <span className="ml-1 animate-caret-blink text-muted-foreground">
          _
        </span>
      )}
    </span>
  );
}
