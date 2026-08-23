import type { LucideIcon } from "lucide-react";

export function Toast({
  show,
  icon: Icon,
  title,
  body,
  tone = "green",
}: {
  show: boolean;
  icon: LucideIcon;
  title: string;
  body: string;
  tone?: "green" | "coral";
}) {
  if (!show) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="toast-in fixed left-1/2 top-4 z-50 w-[min(92vw,26rem)] -translate-x-1/2 rounded-2xl bg-ink p-3.5 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            tone === "coral" ? "bg-coral" : "bg-green"
          }`}
        >
          <Icon className="h-4 w-4 text-paper" aria-hidden />
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-paper">{title}</p>
          <p className="mt-0.5 text-xs text-[#B9C0CE]">{body}</p>
        </div>
      </div>
    </div>
  );
}
