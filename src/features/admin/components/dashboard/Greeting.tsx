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

  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function Greeting() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
    };

    updateTime();

    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const greeting = time ? getGreeting(time) : "Hello";
  const currentDateTime = time
    ? dateTimeFormatter.format(time)
    : "Loading time...";

  return (
    <div>
      <p className="text-sm font-bold">{greeting}, Khant Wai Yan</p>
      <time
        dateTime={time?.toISOString()}
        className="block text-xs text-stone-500"
      >
        {currentDateTime}
      </time>
    </div>
  );
}
