import { useEffect, useState } from "react";
import { timeAgo } from "../utils/timeAgo";

export function TimeAgo({ date }: { date: string }) {
  const [, setTick] = useState(0);

  // re-render every minute so "5 minutes ago" keeps updating
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <time
      dateTime={date}
      title={new Date(date).toLocaleString()}
      className="text-xs text-muted"
    >
      {timeAgo(date)}
    </time>
  );
}