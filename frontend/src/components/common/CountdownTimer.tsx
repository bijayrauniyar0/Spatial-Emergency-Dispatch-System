"use client";

import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  minutes?: number;
  seconds?: number;
  onComplete?: () => void;
  onTick?: (remaining: { minutes: number; seconds: number }) => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  minutes = 5,
  seconds = 0,
  onComplete,
  onTick,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes,
    seconds,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds - 1;

        if (newSeconds < 0) {
          newMinutes--;
          newSeconds = 59;
        }

        if (newMinutes < 0) {
          clearInterval(timer);
          onComplete?.();
          return { minutes: 0, seconds: 0 };
        }

        onTick?.({ minutes: newMinutes, seconds: newSeconds });
        return { minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete, onTick]);

  const formattedTime = `${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`;

  return <span>{formattedTime}</span>;
};

export default CountdownTimer;
