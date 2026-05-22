import { cn } from "@/lib/utils";

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card p-6 space-y-4",
        className
      )}
    >
      {title && (
        <h2 className="font-serif text-xl tracking-tight">{title}</h2>
      )}
      {children}
    </section>
  );
}
