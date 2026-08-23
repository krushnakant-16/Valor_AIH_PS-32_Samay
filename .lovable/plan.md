# Plan: Wolfram Alpha-powered wait-time estimates

## Goal
Replace the naive wait-time calculation (`ahead * avgConsultMinutes`) with a server-side Wolfram Alpha computation that applies real queueing theory (M/M/c, Erlang C), factoring in number of open counters, people ahead, and average consult duration. Falls back to the existing formula if Wolfram is unavailable.

## Why Wolfram fits
Wolfram Alpha is a computational engine that can evaluate queueing-theory expressions (Erlang C average wait for an M/M/c queue). We send it a formed mathematical expression and parse the numeric result — giving a smarter estimate than naive multiplication, especially when multiple counters are open.

## Current state (confirmed)
- Wait time is computed client-side in `PatientView.tsx` line 191: `~{ahead * (dept?.avgConsultMinutes ?? 6)} min`.
- `StaffView.tsx` shows `avgWait` stat (currently `dept.avgConsultMinutes * 4`).
- No backend exists yet; the app is client-only. `createServerFn` works without Lovable Cloud — it runs on the TanStack server runtime.
- Secret `WOLFRAM_APPID` does not exist yet — must be added via `add_secret` (the AppID is a Wolfram-issued credential).

## Changes

### 1. Secret
- Add `WOLFRAM_APPID` via `add_secret` (user supplies their Wolfram AppID into the secure form). Read inside the server function handler as `process.env['WOLFRAM_APPID']`.

### 2. `src/lib/wolfram.server.ts` (new, server-only)
- `queryWolfram(expression: string): Promise<number | null>` — calls `https://api.wolframalpha.com/v2/query` with `appid`, `input=<expression>`, `output=json`, `format=plaintext`, `scantimeout`, parses the JSON result pods for the primary numeric plaintext result. Returns `null` on any failure (network, parse, no result).
- Pure fetch, no Node-only deps (Worker-compatible).

### 3. `src/lib/wait-time.functions.ts` (new, client-safe server function)
- `estimateWaitTime = createServerFn({ method: "POST" })` with inputValidator `{ peopleAhead: number, avgConsultMinutes: number, counters: number }`.
- Builds an Erlang C / M/M/c average-wait expression string from the inputs.
- Calls `queryWolfram`. On success returns the rounded minutes; on `null` returns the naive fallback `peopleAhead * avgConsultMinutes / max(counters,1)` rounded.
- Reads `process.env['WOLFRAM_APPID']` inside the handler.

### 4. `src/routes/index.tsx` + `PatientView.tsx`
- Call `estimateWaitTime` via `useServerFn` + `useQuery` when the patient reaches the confirmed step (has `ahead`, `dept`, `userEntry`).
- Show the Wolfram estimate with a small "computed via Wolfram" label while loading; fall back to the existing inline number on error.

### 5. `StaffView.tsx`
- The "Avg wait" stat is also driven by the same server function (computed from current `waitingCount` + `dept.counters.length` + `avgConsultMinutes`).

### 6. Error handling & UX
- Loading: small spinner / skeleton on the estimate line.
- Wolfram failure: silent fallback to naive formula (no error shown to patient).
- AppID missing: server function returns the fallback (no crash, no exposed error).

## Out of scope
- Lovable Cloud / database / persistence (still a client-only demo).
- Real-time multi-device sync.
- Other Wolfram use cases (medical Q&A, clinical calculators).

## Risk / note
Wolfram Alpha's API is a knowledge/computation engine, not a dedicated queueing service. Parse reliability varies by input phrasing, so the implementation keeps a robust numeric-pod parser and always falls back to the existing formula — Wolfram enhances accuracy when it responds, and never breaks the flow when it doesn't.
