"use client";

import { useUIStore } from "@/lib/stores/uiStore";
import { ToastContainer } from "@/components/ui/Toast";

export function ToastProvider() {
  const { toasts, removeToast } = useUIStore();

  return <ToastContainer toasts={toasts} onDismiss={removeToast} position="top-right" />;
}
