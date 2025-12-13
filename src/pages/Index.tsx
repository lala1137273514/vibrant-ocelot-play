"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import ModeSelector, { TimerMode } from "@/components/ModeSelector";
import { showSuccess } from "@/utils/toast";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

const Index = () => {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Using a ref for the interval so we can clear it easily
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getInitialTime = (currentMode: TimerMode) => {
    switch (currentMode) {
      case "work":
        return 25 * 60;
      case "shortBreak":
        return 5 * 60;
      case "longBreak":
        return 15 * 60;
      default:
        return 25 * 60;
    }
  };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(getInitialTime(newMode));
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getInitialTime(mode));
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      showSuccess("Timer completed!");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-1 text-slate-900">
              Focus Timer
            </h1>
            <p className="text-slate-500">Stay productive and take breaks.</p>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <Link to="/history">
              <History className="h-4 w-4" /> 历史记录
            </Link>
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <ModeSelector currentMode={mode} onModeChange={handleModeChange} />

          <TimerDisplay
            minutes={minutes}
            seconds={seconds}
            isActive={isActive}
            mode={mode}
          />

          <TimerControls
            isActive={isActive}
            onToggle={toggleTimer}
            onReset={resetTimer}
          />

          <div className="mt-12">
            <MadeWithDyad />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;