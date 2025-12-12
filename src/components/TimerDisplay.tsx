"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  isActive: boolean;
  mode: "work" | "shortBreak" | "longBreak";
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  minutes,
  seconds,
  isActive,
  mode,
}) => {
  const formatTime = (time: number) => time.toString().padStart(2, "0");

  const getModeColor = () => {
    switch (mode) {
      case "work":
        return "text-primary";
      case "shortBreak":
        return "text-teal-600";
      case "longBreak":
        return "text-blue-600";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-full border-8 border-slate-100 shadow-xl bg-white w-80 h-80 transition-all duration-300">
      <div className={cn("text-7xl font-bold tracking-tighter tabular-nums", getModeColor())}>
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>
      <div className="mt-2 text-muted-foreground font-medium uppercase tracking-widest text-sm">
        {isActive ? "Running" : "Paused"}
      </div>
    </div>
  );
};

export default TimerDisplay;