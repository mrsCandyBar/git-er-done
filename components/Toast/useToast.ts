'use client';

import { useCallback, useEffect, useRef, useState } from "react";

export type ToastVariant = "success" | "info" | "warning" | "error";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  durationMs: number;
};

const DEFAULT_DURATION_MS = 3200;

export function useToastSystem() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timerMap = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    const timer = timerMap.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timerMap.current[id];
    }
  }, []);

  const pushToast = useCallback((toast: ToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const durationMs = toast.durationMs ?? DEFAULT_DURATION_MS;

    const nextToast: ToastItem = {
      id,
      title: toast.title,
      description: toast.description,
      variant: toast.variant ?? "info",
      durationMs,
    };

    setToasts((prev) => [...prev, nextToast]);

    if (durationMs > 0) {
      timerMap.current[id] = setTimeout(() => {
        dismissToast(id);
      }, durationMs);
    }
  }, [dismissToast]);

  useEffect(() => {
    return () => {
      Object.values(timerMap.current).forEach((timer) => clearTimeout(timer));
      timerMap.current = {};
    };
  }, []);

  return {
    toasts,
    pushToast,
    dismissToast,
  };
}
