import { create } from "zustand";
import type { ToastData } from "@/components/ui/Toast";

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Mobile nav
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  setMobileNavOpen: (open: boolean) => void;

  // Modal
  activeModal: string | null;
  modalData: Record<string, unknown>;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Toasts
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Helper for common toast types
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;

  // Search
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

let toastIdCounter = 0;

export const useUIStore = create<UIState>((set, get) => ({
  // Sidebar
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Mobile nav
  isMobileNavOpen: false,
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),

  // Modal
  activeModal: null,
  modalData: {},
  openModal: (modalId, data = {}) => set({ activeModal: modalId, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: {} }),

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastIdCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  clearToasts: () => set({ toasts: [] }),

  // Helper methods
  showSuccess: (title, message) => {
    get().addToast({ type: "success", title, message });
  },
  showError: (title, message) => {
    get().addToast({ type: "error", title, message });
  },
  showWarning: (title, message) => {
    get().addToast({ type: "warning", title, message });
  },
  showInfo: (title, message) => {
    get().addToast({ type: "info", title, message });
  },

  // Search
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
