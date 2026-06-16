"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function getBackgroundForHour(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return "/background-images/cloudy-sky.webp";
  }

  if (hour >= 12 && hour < 17) {
    return "/background-images/clear-sky.webp";
  }

  if (hour >= 17 && hour < 21) {
    return "/background-images/night-sky.webp";
  }

  return "/background-images/storm-sky.webp";
}

export default function BackGround() {
  const [background, setBackground] = useState(
    "/background-images/clear-sky.webp",
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const hour = new Date().getHours();
      setBackground(getBackgroundForHour(hour));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <Image
      src={background}
      alt="a person overlooking green mountain farms beneath a sky"
      fill
      priority
      sizes="(min-width: 900px) 50vw, 100vw"
      loading="eager"
      className="object-cover object-[center_90%]"
    />
  );
}
