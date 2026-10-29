"use client";

import { useState } from "react";
import { Code2, Dumbbell } from "lucide-react";

const signals = [
  {
    icon: Dumbbell,
    label: "Usually at the gym when not at the keyboard.",
    hint: "A small human detail behind the work.",
  },
  {
    icon: Code2,
    label: "Currently shipping the next Carberk slice.",
    hint: "Tap again to return to the human side.",
  },
] as const;

export function HumanSignal() {
  const [signalIndex, setSignalIndex] = useState(0);
  const signal = signals[signalIndex];
  const Icon = signal.icon;

  return (
    <div className="space-y-3">
      <p className="font-mono text-xs text-muted-foreground">Human signal</p>
      <button
        type="button"
        aria-label={`${signal.label} ${signal.hint}`}
        aria-pressed={signalIndex === 1}
        onClick={() => setSignalIndex((index) => (index + 1) % signals.length)}
        className="group flex min-h-11 items-center gap-3 text-left"
      >
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors duration-300 group-hover:border-primary/30 group-focus-visible:border-primary/50">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-status-in-progress/30 motion-safe:animate-[human-signal_3.6s_ease-in-out_infinite]"
          />
          <Icon className="relative size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </span>
        <span>
          <span className="block text-sm text-foreground">{signal.label}</span>
          <span className="block text-xs text-muted-foreground">{signal.hint}</span>
        </span>
      </button>
    </div>
  );
}
