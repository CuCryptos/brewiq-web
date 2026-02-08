"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function AuthPrompt({
  isOpen,
  onClose,
  title = "Join BrewIQ",
  message = "Sign up to unlock this feature and start your beer journey.",
}: AuthPromptProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-muted-foreground mb-6">{message}</p>
      <div className="flex flex-col gap-3">
        <Link href="/register" onClick={onClose}>
          <Button className="w-full" size="lg">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Free Account
          </Button>
        </Link>
        <Link href="/login" onClick={onClose}>
          <Button variant="outline" className="w-full">
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </Link>
      </div>
    </Modal>
  );
}

// Hook for easy usage in any component
export function useAuthPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{ title?: string; message?: string }>({});

  const showAuthPrompt = (title?: string, message?: string) => {
    setConfig({ title, message });
    setIsOpen(true);
  };

  const closeAuthPrompt = () => setIsOpen(false);

  return { isOpen, config, showAuthPrompt, closeAuthPrompt };
}
