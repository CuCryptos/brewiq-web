"use client";

import { Fragment, useEffect, useRef, useCallback, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  size = "md",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // Save previously focused element when modal opens
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
    }
  }, [isOpen]);

  // Auto-focus first focusable element when modal opens
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Focus restoration on close / unmount
  useEffect(() => {
    if (isOpen) return;

    const elementToRestore = previousFocusRef.current;
    if (elementToRestore && elementToRestore instanceof HTMLElement) {
      elementToRestore.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Escape key and focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-[95vw] max-h-[95vh]",
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-stout-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onKeyDown={handleKeyDown}
      >
        <div
          ref={dialogRef}
          className={cn(
            "relative w-full rounded-2xl bg-card shadow-xl animate-scale-in",
            sizeClasses[size],
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-5 pb-0">
              <div>
                {title && (
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold text-card-foreground"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="modal-description"
                    className="mt-1 text-sm text-muted-foreground"
                  >
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-5">{children}</div>
        </div>
      </div>
    </Fragment>
  );
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-border pt-4 mt-4",
        className
      )}
    >
      {children}
    </div>
  );
}
