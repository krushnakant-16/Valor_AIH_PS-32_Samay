# Samay — Assumptions

- Stack is TanStack Start (React 19 + Tailwind v4), not Next.js — the Lovable template is fixed to this router/framework. All design tokens, flip-token behaviour and UX from the reference prototype are preserved.
- This first milestone ships the two connected surfaces (patient app + staff dashboard) sharing one live in-memory queue, so the live-sync moment works end to end.
- SMS is stubbed as visible "SMS sent" toasts (confirmation, 3-ahead nudge, your-turn) until Twilio credentials and Lovable Cloud are enabled; the trigger points match the spec.
- Persistence, phone OTP auth, RBAC, multi-facility data and real-time fan-out require Lovable Cloud (Postgres + server functions + realtime); the schema in the spec maps directly onto it as the next step.
- ETA = people_ahead x department avg_consult_minutes, per spec.
- Counter allocation assigns each new token to the least-loaded open counter in the department; staff can reassign manually.
