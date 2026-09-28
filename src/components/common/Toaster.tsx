"use client";

import { useEffect, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { dismissToast, selectToasts, type ToastTone } from "@/store/slices/notificationsSlice";
import { cn } from "@/utils/cn";

const TONE_STYLES: Record<ToastTone, { className: string; icon: ReactNode }> = {
  success: { className: "border-success-500/40", icon: <CheckCircle2 className="size-4 text-success-500" /> },
  error: { className: "border-danger-500/40", icon: <XCircle className="size-4 text-danger-500" /> },
  warning: {
    className: "border-warning-500/40",
    icon: <AlertTriangle className="size-4 text-warning-500" />,
  },
  info: { className: "border-brand-500/40", icon: <Info className="size-4 text-brand-500" /> },
};

export function Toaster() {
  const toasts = useAppSelector(selectToasts);
  const dispatch = useAppDispatch();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => dispatch(dismissToast(toast.id))} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: { id: string; title: string; message?: string; tone: ToastTone; durationMs: number };
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, toast.durationMs);
    return () => clearTimeout(timer);
  }, [toast.durationMs, onDismiss]);

  const style = TONE_STYLES[toast.tone];

  return (
    <div className={cn("panel pointer-events-auto animate-fade-up rounded-xl p-3.5", style.className)}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{style.icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-ink">{toast.title}</p>
          {toast.message ? <p className="mt-0.5 text-xs text-ink-3">{toast.message}</p> : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="rounded p-0.5 text-ink-3 hover:text-ink"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
