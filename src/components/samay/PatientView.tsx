import {
  ArrowLeft,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import { FlipToken } from "./FlipToken";
import { DEPTS, SLOTS, type Department, type QueueEntry } from "@/lib/samay-data";

export type PatientStep = "search" | "hospital" | "slots" | "confirmed";

export function PatientView({
  step,
  setStep,
  dept,
  setDept,
  bookSlot,
  userToken,
  ahead,
  nowServing,
  userEntry,
}: {
  step: PatientStep;
  setStep: (s: PatientStep) => void;
  dept: Department | null;
  setDept: (d: Department) => void;
  bookSlot: (s: string) => void;
  userToken: string | null;
  ahead: number;
  nowServing: string;
  userEntry: QueueEntry | undefined;
}) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-6">
      <div className="rounded-3xl border border-line bg-panel p-5 shadow-sm">
        {step === "search" && (
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-coral">
              Find care
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-ink">
              Book an appointment
            </h1>
            <p className="mt-2 flex items-center gap-1 text-xs text-slate">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> Bengaluru, MG Road area
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2.5">
              <Search className="h-4 w-4 text-slate" aria-hidden />
              <input
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate"
                placeholder="Search hospitals, clinics, offices"
                aria-label="Search facilities"
              />
            </div>

            <button
              onClick={() => setStep("hospital")}
              className="mt-4 w-full rounded-2xl bg-ink p-4 text-left transition hover:opacity-95"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-saffron" aria-hidden />
                  <span className="font-display text-sm font-semibold text-paper">
                    City Care Multispeciality Hospital
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#B9C0CE]" aria-hidden />
              </div>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-[#B9C0CE]">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" aria-hidden /> 1.2 km
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-saffron" aria-hidden /> 4.4
                </span>
                <span className="rounded-full bg-coral px-2 py-0.5 font-mono font-semibold text-ink">
                  ~24 min wait
                </span>
              </div>
            </button>

            <p className="mt-4 rounded-xl bg-paper p-3 text-[11px] leading-relaxed text-slate">
              70,000+ hospitals and clinics are searchable on Samay — this demo shows one.
            </p>
          </div>
        )}

        {step === "hospital" && (
          <div>
            <button
              onClick={() => setStep("search")}
              className="mb-3 flex items-center gap-1 text-xs text-slate"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back
            </button>
            <h2 className="font-display text-xl font-bold text-ink">Choose a department</h2>
            <div className="mt-4 grid gap-2">
              {DEPTS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDept(d);
                    setStep("slots");
                  }}
                  className="flex items-center justify-between rounded-xl border border-line p-3.5 transition hover:bg-paper"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-paper">
                      <d.icon className="h-4 w-4 text-ink" aria-hidden />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-ink">{d.name}</p>
                      <p className="text-[11px] text-slate">{d.room}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-coral">~{d.wait} min</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "slots" && dept && (
          <div>
            <button
              onClick={() => setStep("hospital")}
              className="mb-3 flex items-center gap-1 text-xs text-slate"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back
            </button>
            <h2 className="font-display text-xl font-bold text-ink">{dept.name} — today</h2>
            <p className="mt-1 text-xs text-slate">Pick a slot to get your token instantly.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {SLOTS.map((s) => (
                <button
                  key={s}
                  onClick={() => bookSlot(s)}
                  className="rounded-xl border border-line bg-paper py-3 font-mono text-sm font-semibold text-ink transition hover:bg-ink hover:text-paper"
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => bookSlot("Walk-in")}
              className="mt-3 w-full rounded-xl bg-coral py-3 font-display text-sm font-semibold text-ink"
            >
              Take a walk-in token instead
            </button>
          </div>
        )}

        {step === "confirmed" && userToken && (
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green" aria-hidden />
              <p className="text-sm font-semibold text-green">Booking confirmed</p>
            </div>

            <div className="mt-4 rounded-2xl bg-paper p-4">
              <p className="text-[11px] uppercase tracking-wider text-slate">Your token</p>
              <div className="mt-2">
                <FlipToken token={userToken} size="lg" />
              </div>
              <p className="mt-3 text-xs text-slate">
                {dept ? dept.name : ""} · {userEntry?.counter ?? dept?.room}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-line p-3">
                <p className="text-[11px] text-slate">Now serving</p>
                <p className="mt-1 font-mono text-lg font-semibold text-ink">{nowServing}</p>
              </div>
              <div className="rounded-xl border border-line p-3">
                <p className="text-[11px] text-slate">People ahead</p>
                <p className="mt-1 font-mono text-lg font-semibold text-ink">{ahead}</p>
              </div>
            </div>

            <div className="mt-3 flex items-start gap-3 rounded-xl bg-ink p-3.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden />
              <div>
                <p className="font-display text-sm font-semibold text-paper">
                  Estimated wait: ~{ahead * (dept?.avgConsultMinutes ?? 6)} min
                </p>
                <p className="mt-0.5 text-[11px] text-[#B9C0CE]">
                  {userEntry && userEntry.status === "serving"
                    ? "It's your turn — head in now."
                    : "We'll text you as your turn approaches."}
                </p>
              </div>
            </div>

            {userEntry && userEntry.status === "serving" && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-coral p-3.5">
                <Bell className="h-4 w-4 text-ink" aria-hidden />
                <p className="text-sm font-semibold text-ink">
                  Your turn is now — proceed to {userEntry.counter}.
                </p>
              </div>
            )}

            <p className="mt-4 text-center text-[11px] text-slate">
              Switch to Staff dashboard and tap “Call next” to see this update live.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
