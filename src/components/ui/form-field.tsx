import { type ReactNode } from "react";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  type?: "text" | "number";
  placeholder?: string;
  defaultValue?: string;
  children?: ReactNode;
}

export function FormField({ label, name, error, required, type = "text", placeholder, defaultValue, children }: FormFieldProps) {
  const inputId = `field-${name}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children ? (
        children
      ) : (
        <Input
          id={inputId}
          name={name}
          type={type === "number" ? "number" : "text"}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-invalid={!!error}
          aria-required={required ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
