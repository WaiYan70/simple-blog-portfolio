"use client";

import { useEffect, useState } from "react";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Bangkok",
});

function getGreeting(date: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: "Asia/Bangkok",
    }).format(date),
  );

  if (hour >= 5 && hour < 12) return "Morning";

  if (hour >= 12 && hour < 17) return "Afternoon";

  if (hour >= 17 && hour < 21) return "Evening";

  return "Night";
}

export default function LoginGreeting() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
    };

    updateTime();

    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const greeting = time ? getGreeting(time) : "hello";
  const currentTime = time ? dateTimeFormatter.format(time) : "Loading Time";

  return (
    <div className="relative mt-[6.7vh] ml-[8.9%]">
      <h2 className="font-[750] text-black text-2xl text-[clamp(2rem, 2.65vw, 2.875rem)] leading-[1.1] tracking-[-0.035em]">
        Welcome Back!
      </h2>
      <h2 className="mt-1.5 font-[750] text-black text-xl text-[clamp(1.8rem, 2.35vw, 2.575rem)] leading-[1.1] tracking-[-0.035em]">
        {greeting}, Khant Wai Yan
      </h2>
      <time className="text-black">{currentTime}</time>
      <p className="font-medium text-black/80 mt-[1.6rem] text-[clamp(1rem,1.42vw,1.5rem)] leading-[1.55] tracking-[-0.012em]">
        Access your dashboard to <br /> manage your blog and portfolio
      </p>
    </div>
  );
}
