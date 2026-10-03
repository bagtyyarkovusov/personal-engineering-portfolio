import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestimonialQuote {
  quote: string;
  name: string;
  attribution: string;
}

interface TestimonialsProps {
  quotes: TestimonialQuote[];
  className?: string;
}

export function Testimonials({ quotes, className }: TestimonialsProps) {
  if (quotes.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-6", className)}>
      <h2 className="font-serif text-2xl tracking-tight text-foreground">
        What clients say
      </h2>
      <ul className="space-y-4">
        {quotes.map((item) => (
          <li
            key={`${item.name}-${item.attribution}`}
            className="space-y-3 rounded-lg border border-border bg-card p-6"
          >
            <Quote className="size-4 text-primary" aria-hidden="true" />
            <blockquote className="leading-relaxed text-foreground">
              {item.quote}
            </blockquote>
            <footer className="text-sm">
              <span className="font-medium text-card-foreground">
                {item.name}
              </span>
              <span className="text-muted-foreground">
                {" "}
                · {item.attribution}
              </span>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
