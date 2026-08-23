import { Stethoscope, Heart, Baby, type LucideIcon } from "lucide-react";

export type QueueStatus = "waiting" | "serving" | "done" | "no_show";

export type QueueEntry = {
  id: number;
  token: string;
  name: string;
  status: QueueStatus;
  counter: string;
  isUser?: boolean;
};

export type Department = {
  id: string;
  name: string;
  icon: LucideIcon;
  wait: number;
  room: string;
  avgConsultMinutes: number;
  counters: string[];
};

export const DEPTS: Department[] = [
  {
    id: "gm",
    name: "General Medicine",
    icon: Stethoscope,
    wait: 24,
    room: "Room 4",
    avgConsultMinutes: 6,
    counters: ["Room 4", "Room 5"],
  },
  {
    id: "cardio",
    name: "Cardiology",
    icon: Heart,
    wait: 40,
    room: "Room 9",
    avgConsultMinutes: 10,
    counters: ["Room 9"],
  },
  {
    id: "peds",
    name: "Pediatrics",
    icon: Baby,
    wait: 12,
    room: "Room 2",
    avgConsultMinutes: 5,
    counters: ["Room 2", "Room 3"],
  },
];

export const SLOTS = ["10:30 AM", "10:45 AM", "11:00 AM", "11:15 AM"];

export const CHART_DATA = [
  { time: "9 AM", wait: 35 },
  { time: "10 AM", wait: 42 },
  { time: "11 AM", wait: 38 },
  { time: "12 PM", wait: 50 },
  { time: "1 PM", wait: 45 },
  { time: "2 PM", wait: 30 },
  { time: "3 PM", wait: 24 },
];

export const SEED_QUEUE: QueueEntry[] = [
  { id: 1, token: "A-101", name: "R. Sharma", status: "done", counter: "Room 4" },
  { id: 2, token: "A-102", name: "S. Iyer", status: "done", counter: "Room 5" },
  { id: 3, token: "A-103", name: "K. Verma", status: "done", counter: "Room 4" },
  { id: 4, token: "A-104", name: "P. Nair", status: "serving", counter: "Room 4" },
  { id: 5, token: "A-105", name: "A. Gupta", status: "waiting", counter: "Room 5" },
  { id: 6, token: "A-106", name: "M. Khan", status: "waiting", counter: "Room 4" },
  { id: 7, token: "A-107", name: "D. Rao", status: "waiting", counter: "Room 5" },
];

export const AVG_MIN = 6;

/** Optimized staff allocation: send the new token to the least-loaded open counter. */
export function assignCounter(queue: QueueEntry[], counters: string[]): string {
  const load = (c: string) =>
    queue.filter((q) => q.counter === c && (q.status === "waiting" || q.status === "serving")).length;
  return [...counters].sort((a, b) => load(a) - load(b))[0] ?? "Counter 1";
}
