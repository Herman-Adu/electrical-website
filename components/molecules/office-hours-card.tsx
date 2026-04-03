/**
 * MOLECULE: OfficeHoursCard
 *
 * Displays office hours with live open/closed status
 */

"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface DayHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

const officeHours: DayHours[] = [
  { day: "Monday", open: "08:00", close: "18:00" },
  { day: "Tuesday", open: "08:00", close: "18:00" },
  { day: "Wednesday", open: "08:00", close: "18:00" },
  { day: "Thursday", open: "08:00", close: "18:00" },
  { day: "Friday", open: "08:00", close: "17:00" },
  { day: "Saturday", open: "09:00", close: "13:00" },
  { day: "Sunday", open: "00:00", close: "00:00", isClosed: true },
];

function getCurrentStatus(): { isOpen: boolean; nextChange: string } {
  const now = new Date();
  const dayIndex = now.getDay();
  const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert to Monday-first
  const currentDay = officeHours[adjustedIndex];

  if (currentDay.isClosed) {
    return { isOpen: false, nextChange: "Opens Monday at 08:00" };
  }

  const currentTime = now.getHours() * 100 + now.getMinutes();
  const openTime = parseInt(currentDay.open.replace(":", ""));
  const closeTime = parseInt(currentDay.close.replace(":", ""));

  if (currentTime >= openTime && currentTime < closeTime) {
    return { isOpen: true, nextChange: `Closes at ${currentDay.close}` };
  } else if (currentTime < openTime) {
    return { isOpen: false, nextChange: `Opens at ${currentDay.open}` };
  } else {
    // After closing, find next open day
    const nextDayIndex = (adjustedIndex + 1) % 7;
    const nextDay = officeHours[nextDayIndex];
    if (nextDay.isClosed) {
      return { isOpen: false, nextChange: "Opens Monday at 08:00" };
    }
    return {
      isOpen: false,
      nextChange: `Opens ${nextDay.day} at ${nextDay.open}`,
    };
  }
}

export function OfficeHoursCard() {
  const [status, setStatus] = useState<{ isOpen: boolean; nextChange: string }>(
    {
      isOpen: false,
      nextChange: "",
    },
  );
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    const updateStatus = () => {
      setStatus(getCurrentStatus());
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      setCurrentDay(days[new Date().getDay()]);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-linear-to-r from-accent/10 to-transparent border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-foreground">Office Hours</h3>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              status.isOpen
                ? "bg-green-500/20 text-green-600 dark:text-green-400"
                : "bg-red-500/20 text-red-600 dark:text-red-400"
            }`}
          >
            {status.isOpen ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Open Now
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Closed
              </>
            )}
          </div>
        </div>
        {status.nextChange && (
          <p className="text-xs text-muted-foreground mt-1">
            {status.nextChange}
          </p>
        )}
      </div>

      {/* Hours List */}
      <div className="p-4">
        <div className="space-y-2">
          {officeHours.map((day) => (
            <div
              key={day.day}
              className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                day.day === currentDay
                  ? "bg-accent/10 border border-accent/20"
                  : "hover:bg-accent/5"
              }`}
            >
              <span
                className={`text-sm ${
                  day.day === currentDay
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {day.day}
              </span>
              <span
                className={`text-sm ${
                  day.isClosed
                    ? "text-muted-foreground"
                    : day.day === currentDay
                      ? "font-medium text-accent"
                      : "text-foreground"
                }`}
              >
                {day.isClosed ? "Closed" : `${day.open} - ${day.close}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="px-4 pb-4">
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            <strong>24/7 Emergency Service:</strong> For urgent electrical
            emergencies outside office hours, please use our emergency service
            request form.
          </p>
        </div>
      </div>
    </div>
  );
}
