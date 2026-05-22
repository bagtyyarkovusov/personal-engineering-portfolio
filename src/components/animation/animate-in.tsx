"use client";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "scale-in" | "slide-down";
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
}

export function AnimateIn({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold,
  rootMargin,
}: AnimateInProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  const animationStyles: React.CSSProperties = {
    animationName: isInView ? animation : "none",
    animationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
    animationFillMode: "both",
    animationTimingFunction: "var(--ease-out-quart)",
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={animationStyles}
    >
      {children}
    </div>
  );
}
