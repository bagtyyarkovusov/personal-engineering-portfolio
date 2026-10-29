"use client";

import Image from "next/image";
import { Code2 } from "lucide-react";
import { useId, useState } from "react";

export function HumanSignal() {
  const [showGym, setShowGym] = useState(true);
  const captionId = useId();
  const caption = showGym ? "Away from the keyboard." : "At the keyboard.";
  const nextLabel = showGym ? "Back to work" : "Gym break";

  return (
    <div className="max-w-md">
      <button
        type="button"
        aria-label={nextLabel}
        aria-describedby={captionId}
        onClick={() => setShowGym((current) => !current)}
        className="group grid w-full grid-cols-[7rem_1fr] gap-4 rounded-lg border border-border bg-card/60 p-2 text-left transition-colors duration-300 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="relative min-h-28 overflow-hidden rounded-md border border-border bg-muted">
          {showGym ? (
            <Image
              src="/bagtyyar-gym.jpg"
              alt="Bagtyyar training at the gym"
              fill
              sizes="112px"
              className="object-cover object-center motion-safe:animate-[fade-in_300ms_ease-out]"
            />
          ) : (
            <span
              className="flex size-full min-h-28 items-center justify-center text-foreground motion-safe:animate-[fade-in_300ms_ease-out]"
            >
              <Code2 className="size-6" aria-hidden="true" />
            </span>
          )}
        </span>

        <span className="flex min-h-28 flex-col justify-center py-1 pr-2">
          <span id={captionId} className="text-sm leading-5 text-foreground">
            {caption}
          </span>
          <span className="mt-2 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
            {nextLabel}
          </span>
        </span>
      </button>
    </div>
  );
}
