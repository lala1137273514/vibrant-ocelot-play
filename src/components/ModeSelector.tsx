"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TimerMode = "work" | "shortBreak" | "longBreak";

interface ModeSelectorProps {
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
}) => {
  const modes: { id: TimerMode; label: string }[] = [
    { id: "work", label: "Work" },
    { id: "shortBreak", label: "Short Break" },
    { id: "longBreak", label: "Long Break" },
  ];

  return (
    <div className="flex p-1 bg-slate-100 rounded-full mb-8">
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant="ghost"
          onClick={() => onModeChange(mode.id)}
          className={cn(
            "rounded-full px-6 py-2 transition-all duration-300",
            currentMode === mode.id
              ? "bg-white shadow-md text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {mode.label}
        </Button>
      ))}
    </div>
  );
};

export default ModeSelector;