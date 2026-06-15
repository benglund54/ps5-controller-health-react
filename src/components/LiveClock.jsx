import { useEffect, useState } from "react";

function buildClockLabel() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(new Date());
}

export function LiveClock() {
  const [label, setLabel] = useState(buildClockLabel);

  useEffect(() => {
    const tick = () => setLabel(buildClockLabel());
    tick();

    const interval = setInterval(tick, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="ps5-live-clock">{label}</span>;
}
