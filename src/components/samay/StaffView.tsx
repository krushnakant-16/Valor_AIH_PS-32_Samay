import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCircle2, Clock, PhoneCall, UserX, Users } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FlipToken } from "./FlipToken";
import { CHART_DATA, type Department, type QueueEntry } from "@/lib/samay-data";
import { estimateWaitTime } from "@/lib/wait-time.functions";

const STATUS_STYLE: Record<QueueEntry["status"], string> = {
  waiting: "bg-paper text-slate",
  serving: "bg-coral text-ink",
  done: "bg-green/15 text-green",
  no_show: "bg-ink/10 text-ink",
};

export function StaffView({
  dept,
  queue,
  nowServing,
  callNext,
  markNoShow,
  reassign,
  waitingCount,
  servedCount,
  noShowRate,
  avgWait,
}: {
  dept: Department;
  queue: QueueEntry[];
  nowServing: string;
  callNext: () => void;
  markNoShow: (id: number) => void;
  reassign: (id: number) => void;
  waitingCount: number;
  servedCount: number;
  noShowRate: string;
  avgWait: string;
}) {
  const estimateFn = useServerFn(estimateWaitTime);
  const { data: avgData } = useQuery({
    queryKey: ["wait-staff", waitingCount, dept.id, dept.counters.length],
    queryFn: () =>
      estimateFn({
        data: {
          peopleAhead: waitingCount,
          avgConsultMinutes: dept.avgConsultMinutes,
          counters: dept.counters.length,
        },
      }),
  });
  const avgWaitValue = avgData?.minutes != null ? `${avgData.minutes} min` : avgWait;

  const stats = [
    { label: "Waiting now", value: String(waitingCount), icon: Users },
    { label: "Served today", value: String(servedCount), icon: CheckCircle2 },
    { label: "Avg wait", value: avgWaitValue, icon: Clock },
    { label: "No-show rate", value: noShowRate, icon: Bell },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line bg-panel p-5">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate">
            City Care OPD · {dept.name}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">Queue dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate">Now serving</p>
            <div className="mt-1">
              <FlipToken token={nowServing} />
            </div>
          </div>
          <button
            onClick={callNext}
            className="flex items-center gap-2 rounded-xl bg-coral px-4 py-3 font-display text-sm font-semibold text-ink transition hover:opacity-90"
          >
            <PhoneCall className="h-4 w-4" aria-hidden /> Call next
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-panel p-4">
            <s.icon className="h-4 w-4 text-coral" aria-hidden />
            <p className="mt-2 font-mono text-xl font-semibold text-ink">{s.value}</p>
            <p className="text-[11px] text-slate">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-panel p-5">
          <p className="font-display text-sm font-semibold text-ink">Live queue</p>
          <div className="mt-3 grid gap-2">
            {queue.map((q) => (
              <div
                key={q.id}
                className="row-in flex items-center justify-between rounded-xl border border-line px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-ink">{q.token}</span>
                  <span className="text-xs text-slate">
                    {q.name}
                    {q.isUser ? " (you — patient app)" : ""}
                  </span>
                  <span className="rounded-full bg-paper px-2 py-0.5 text-[10px] text-slate">
                    {q.counter}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {q.status === "waiting" && dept.counters.length > 1 && (
                    <button
                      onClick={() => reassign(q.id)}
                      className="rounded-full border border-line px-2 py-0.5 text-[10px] text-slate hover:bg-paper"
                      aria-label={`Reassign token ${q.token} to another counter`}
                    >
                      Reassign
                    </button>
                  )}
                  {q.status === "serving" && (
                    <button
                      onClick={() => markNoShow(q.id)}
                      className="flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[10px] text-slate hover:bg-paper"
                      aria-label={`Mark token ${q.token} as no-show`}
                    >
                      <UserX className="h-3 w-3" aria-hidden /> No-show
                    </button>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${STATUS_STYLE[q.status]}`}
                  >
                    {q.status.replace("_", "-")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-line bg-panel p-5">
            <p className="font-display text-sm font-semibold text-ink">Counter load</p>
            <p className="text-[11px] text-slate">Auto-balanced when a new token is issued</p>
            <div className="mt-3 grid gap-2">
              {dept.counters.map((c) => {
                const open = queue.filter(
                  (q) => q.counter === c && (q.status === "waiting" || q.status === "serving"),
                ).length;
                return (
                  <div
                    key={c}
                    className="flex items-center justify-between rounded-xl bg-paper px-3 py-2"
                  >
                    <span className="text-xs font-semibold text-ink">{c}</span>
                    <span className="font-mono text-xs text-slate">{open} in line</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-panel p-5">
            <p className="font-display text-sm font-semibold text-ink">Wait time today</p>
            <p className="text-[11px] text-slate">Live estimate, minutes</p>
            <div className="mt-3 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="var(--slate)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--slate)" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="wait"
                    stroke="var(--coral)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
