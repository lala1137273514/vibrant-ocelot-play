"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerControlsProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isActive,
  onToggle,
  onReset,
}) => {
  return (
    <div className="flex gap-4 mt-8">
      <Button
        onClick={onToggle}
        size="lg"
        className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
        variant={isActive ? "secondary" : "default"}
      >
        {isActive ? (
          <>
            <Pause className="mr-2 h-5 w-5" /> Pause
          </>
        ) : (
          <>
            <Play className="mr-2 h-5 w-5" /> Start
          </>
        )}
      </Button>
      <Button
        onClick={onReset}
        size="icon"
        variant="outline"
        className="h-14 w-14 rounded-full border-2"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default TimerControls;