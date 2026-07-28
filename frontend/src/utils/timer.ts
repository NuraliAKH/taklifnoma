import { useState, useEffect } from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

/**
 * Parses date string (e.g. "2026-07-29", "29.07.2026", "29.07", "15 сентября 2026")
 * and time string (e.g. "21:00", "18:30") into a local Date object.
 */
export function parseEventDateTime(dateStr?: string, timeStr?: string): Date {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth(); // 0-indexed
  let day = now.getDate();
  let hours = 18;
  let minutes = 0;

  if (timeStr) {
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
    }
  }

  if (dateStr) {
    const isoMatch = dateStr.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    const ruMatch = dateStr.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
    const shortRuMatch = dateStr.match(/^(\d{1,2})[-/.](\d{1,2})$/);

    if (isoMatch) {
      year = parseInt(isoMatch[1], 10);
      month = parseInt(isoMatch[2], 10) - 1;
      day = parseInt(isoMatch[3], 10);
    } else if (ruMatch) {
      day = parseInt(ruMatch[1], 10);
      month = parseInt(ruMatch[2], 10) - 1;
      year = parseInt(ruMatch[3], 10);
    } else if (shortRuMatch) {
      day = parseInt(shortRuMatch[1], 10);
      month = parseInt(shortRuMatch[2], 10) - 1;
    } else {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        year = parsed.getFullYear();
        month = parsed.getMonth();
        day = parsed.getDate();
      }
    }
  }

  return new Date(year, month, day, hours, minutes, 0, 0);
}

/**
 * Calculates time remaining from now until target date.
 */
export function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPassed: false };
}

/**
 * Custom hook to get real-time countdown.
 * If externalTimeLeft is provided, uses it. Otherwise calculates from dateStr & timeStr.
 */
export function useCountdownTimer(
  dateStr?: string,
  timeStr?: string,
  externalTimeLeft?: TimeLeft
): TimeLeft {
  const [internalTimeLeft, setInternalTimeLeft] = useState<TimeLeft>(() => {
    if (externalTimeLeft) return externalTimeLeft;
    const targetDate = parseEventDateTime(dateStr, timeStr);
    return calculateTimeLeft(targetDate);
  });

  useEffect(() => {
    if (externalTimeLeft) {
      setInternalTimeLeft(externalTimeLeft);
      return;
    }

    const updateTimer = () => {
      const targetDate = parseEventDateTime(dateStr, timeStr);
      setInternalTimeLeft(calculateTimeLeft(targetDate));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [dateStr, timeStr, externalTimeLeft]);

  return externalTimeLeft || internalTimeLeft;
}
