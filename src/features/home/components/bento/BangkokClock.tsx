"use clien";

import { useState, useEffect } from "react";

export function BangkokClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Bangkok",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      hour12: false,
    });

    const updateTime = () => {
      const parts = formatter.formatToParts(new Date());
      const weekday = parts.find((part) => part.type === "weekday")?.value;
      const hour = parts.find((part) => part.type === "hour")?.value;
      const minute = parts.find((part) => part.type === "minute")?.value;
      const second = parts.find((part) => part.type === "second")?.value;

      if (weekday && hour && minute && second) {
        setTime(`${weekday}, ${hour}:${minute}:${second}`);
      }
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <time
      dateTime={time}
      className="mt-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium tabular-nums text-primary"
    >
      {time || "---, --:--:--"}
    </time>
  );
}
