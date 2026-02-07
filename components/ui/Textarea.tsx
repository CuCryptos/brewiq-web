"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground shadow-sm transition-colors resize-y",
            "placeholder:text-muted-foreground",
            "focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p id={`${textareaId}-error`} role="alert" className="mt-1.5 text-sm text-destructive">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
