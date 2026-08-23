import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCircle2, RotateCcw, Ticket } from "lucide-react";
import { PatientView, type PatientStep } from "@/components/samay/PatientView";
import { StaffView } from "@/components/samay/StaffView";
import { Toast } from "@/components/samay/Toast";
import {
  DEPTS,
  SEED_QUEUE,
  assignCounter,
  type Department,
  type QueueEntry,
} from "@/lib/samay-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Samay — Skip the line, not the care" },
      {
        name: "description",
        content:
          "Book appointments, get a live digital token, and track real wait times at hospitals, clinics and government offices.",
      },
      { property: "og:title", content: "Samay — Skip the line, not the care" },
      {
        property: "og:description",
        content:
          "Digital queue and appointment management: live tokens, real wait estimates and SMS updates.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<"patient" | "staff">("patient");
  const [step, setStep] = useState<PatientStep>("search");
  const [dept, setDept] = useState<Department | null>(null);
  const [queue, setQueue] = useState<QueueEntry[]>(SEED_QUEUE);
  const [nextNum, setNextNum] = useState(108);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [bookToast, setBookToast] = useState(false);
  const [turnToast, setTurnToast] = useState(false);
  const [nearToast, setNearToast] = useState(false);

  const activeDept = dept ?? DEPTS[0]!;
  const serving = queue.find((q) => q.status === "serving");
  const nowServing = serving ? serving.token : "—";
  const userEntry = queue.find((q) => q.isUser);

  const ahead = useMemo(() => {
    if (!userEntry) return 0;
    const idx = queue.findIndex((q) => q.id === userEntry.id);
    return queue.slice(0, idx).filter((q) => q.status === "waiting" || q.status === "serving")
      .length;
  }, [queue, userEntry]);

  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bookTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (turnTimer.current) clearTimeout(turnTimer.current);
      if (nearTimer.current) clearTimeout(nearTimer.current);
      if (bookTimer.current) clearTimeout(bookTimer.current);
    },
    [],
  );

  const prevUserStatus = useRef<string | null>(null);
  useEffect(() => {
    if (!userEntry) return;
    if (prevUserStatus.current === "waiting" && userEntry.status === "serving") {
      setTurnToast(true);
      if (turnTimer.current) clearTimeout(turnTimer.current);
      turnTimer.current = setTimeout(() => setTurnToast(false), 5000);
    }
    prevUserStatus.current = userEntry.status;
  }, [userEntry]);

  const nudged = useRef(false);
  useEffect(() => {
    if (userEntry && userEntry.status === "waiting" && ahead <= 3 && ahead > 0 && !nudged.current) {
      nudged.current = true;
      setNearToast(true);
      if (nearTimer.current) clearTimeout(nearTimer.current);
      nearTimer.current = setTimeout(() => setNearToast(false), 4000);
    }
  }, [ahead, userEntry]);

  function bookSlot() {
    const token = `A-${nextNum}`;
    setQueue((q) => [
      ...q,
      {
        id: Date.now(),
        token,
        name: "You",
        status: "waiting",
        counter: assignCounter(q, activeDept.counters),
        isUser: true,
      },
    ]);
    setNextNum((n) => n + 1);
    setUserToken(token);
    setStep("confirmed");
    setBookToast(true);
    if (bookTimer.current) clearTimeout(bookTimer.current);
    bookTimer.current = setTimeout(() => setBookToast(false), 4000);
  }

  function callNext() {
    setQueue((q) => {
      const next = q.map((e) => ({ ...e }));
      const servingIdx = next.findIndex((e) => e.status === "serving");
      if (servingIdx !== -1) next[servingIdx]!.status = "done";
      const waitingIdx = next.findIndex((e) => e.status === "waiting");
      if (waitingIdx !== -1) next[waitingIdx]!.status = "serving";
      return next;
    });
  }

  function markNoShow(id: number) {
    setQueue((q) => {
      const next = q.map((e) => (e.id === id ? { ...e, status: "no_show" as const } : { ...e }));
      const waitingIdx = next.findIndex((e) => e.status === "waiting");
      if (waitingIdx !== -1) next[waitingIdx]!.status = "serving";
      return next;
    });
  }

  function reassign(id: number) {
    setQueue((q) =>
      q.map((e) => {
        if (e.id !== id) return e;
        const others = activeDept.counters.filter((c) => c !== e.counter);
        return { ...e, counter: others[0] ?? e.counter };
      }),
    );
  }

  function resetDemo() {
    setQueue(SEED_QUEUE);
    setNextNum(108);
    setUserToken(null);
    setStep("search");
    setDept(null);
    setBookToast(false);
    setTurnToast(false);
    setNearToast(false);
    prevUserStatus.current = null;
    nudged.current = false;
  }

  const waitingCount = queue.filter((q) => q.status === "waiting").length;
  const servedCount = queue.filter((q) => q.status === "done").length;
  const noShowCount = queue.filter((q) => q.status === "no_show").length;
  const noShowRate =
    queue.length === 0 ? "0%" : `${Math.round((noShowCount / queue.length) * 100)}%`;

  return (
    <div className="min-h-screen bg-paper">
      <Toast
        show={bookToast}
        icon={CheckCircle2}
        title="SMS sent — booking confirmed"
        body={`Token ${userToken} · ${activeDept.name}, City Care Hospital.`}
      />
      <Toast
        show={nearToast}
        icon={Bell}
        title="SMS sent — you're almost up"
        body="3 people ahead of you. Please reach the department."
        tone="coral"
      />
      <Toast
        show={turnToast}
        icon={Bell}
        title="SMS sent — it's your turn"
        body={`Please proceed to ${userEntry?.counter ?? activeDept.room}.`}
        tone="coral"
      />

      <header className="bg-ink">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral">
              <Ticket className="h-4 w-4 text-ink" aria-hidden />
            </div>
            <div>
              <p className="font-display text-lg font-bold leading-none text-paper">Samay</p>
              <p className="mt-1 text-[11px] text-[#B9C0CE]">Skip the line, not the care.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full bg-[#1E2E4A] p-1">
              {(["patient", "staff"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-full px-3.5 py-1.5 font-display text-xs font-semibold transition ${
                    view === v ? "bg-coral text-ink" : "text-[#B9C0CE]"
                  }`}
                >
                  {v === "patient" ? "Patient app" : "Staff dashboard"}
                </button>
              ))}
            </div>
            <button
              onClick={resetDemo}
              className="flex items-center gap-1 rounded-full border border-[#2C3D5C] px-3 py-1.5 text-xs text-[#B9C0CE] transition hover:text-paper"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
            </button>
          </div>
        </div>
      </header>

      {view === "patient" ? (
        <PatientView
          step={step}
          setStep={setStep}
          dept={dept}
          setDept={setDept}
          bookSlot={bookSlot}
          userToken={userToken}
          ahead={ahead}
          nowServing={nowServing}
          userEntry={userEntry}
        />
      ) : (
        <StaffView
          dept={activeDept}
          queue={queue}
          nowServing={nowServing}
          callNext={callNext}
          markNoShow={markNoShow}
          reassign={reassign}
          waitingCount={waitingCount}
          servedCount={servedCount}
          noShowRate={noShowRate}
          avgWait={`${activeDept.avgConsultMinutes * 4} min`}
        />
      )}
    </div>
  );
}
