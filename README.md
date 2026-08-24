# Samay ⏱️
### Skip the line, not the care.
built with the help of Lovable AI

**PS-032 · Digital Queue & Appointment Management Platform**
*Healthcare · Government · Service Management*

---

## The problem

In India, booking a hospital appointment still comes down to exactly two options: **call**, or **show up and wait**. There's no third way — not for the 70,000+ hospitals and clinics across the country.

- **~40 min** average OPD wait time
- **2 in 3** patients face delays with zero visibility into how long they'll actually wait
- Staff are stuck managing paper tokens and ringing phones instead of patients

This isn't just a hospital problem — **the same story plays out at government offices, banks, and any service counter with a line.**

## The solution

**Samay** ("time" in Hindi) is a digital queue and appointment platform with two connected sides:

| For patients | For staff |
|---|---|
| Search a facility, see live wait time before you even walk in | See the full live queue — who's waiting, who's being served |
| Book a slot, get a digital token instantly | Call the next token with one tap |
| Track your position and ETA in real time | See average wait, no-show rate, and per-counter load |
| Get an SMS when your turn is close | Balance load across counters/doctors |

One queue. Two views. Always in sync.

## Features

- ✅ **Online appointments** — search, pick a department, pick a slot, book
- ✅ **Queue dashboard** — live staff-facing view of the queue, replacing the paper token board
- ✅ **Live wait time** — real, computed estimates that update as the queue moves
- ✅ **Token system** — every booking gets a unique digital token (e.g. `A-108`)
- ✅ **SMS notifications** — booking confirmation, plus a "your turn" alert before patients need to be in the building
- ✅ **Staff allocation** — load-balanced across multiple counters/doctors per department, not a single FIFO line

## Try the demo

The working prototype is a single self-contained lovableAI file — no install, no server, no internet connection required after download.

```
https://hello-world-buddy-6123.lovable.app
```

- Toggle between **Patient app** and **Staff dashboard** in the top bar
- Book a slot on the patient side to get a token
- Switch to the staff dashboard and tap **Call next** — watch the patient's wait time and SMS toast update live
- **Reset** (top right) restores the clean starting state for repeat walkthroughs

## Design system

| Token | Hex | Use |
|---|---|---|
| Ink | `#152238` | primary dark / text / nav |
| Paper | `#F3F5EF` | background |
| Coral | `#FF6552` | primary action / live / urgent accent |
| Saffron | `#F2A93B` | secondary warm accent |
| Green | `#2E7D5B` | success / confirmed |

**Type**: Space Grotesk (headings) · Inter (body) · IBM Plex Mono (tokens, timestamps)

**Signature element**: the "now serving" token renders as split-flap tiles — like a physical departure board — with a flip animation on every change.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + Next.js, Tailwind CSS, Progressive Web App |
| Backend | Node.js (NestJS) or Django REST Framework |
| Real-time | WebSockets / Redis pub-sub |
| Database | PostgreSQL (source of truth) + Redis (live queue state) |
| Notifications | Twilio (SMS) |
| Infra | Docker + Kubernetes |

*The current repo contains a validated front-end prototype (mock data, in-memory queue). Backend, database, and real SMS integration are the next build phase — see [`Samay_God_Prompt.md`](./Samay_God_Prompt.md) for the full build specification, data model, and API surface to hand to an AI app-building tool or a dev team.*

## Project structure

```
├── Samay_Demo.html            # working prototype — open directly in a browser
├── samay-demo.jsx             # clean React source of the prototype (for reuse in a real build)
├── Samay_God_Prompt.md        # full product spec + reference code, for building the real app
├── Samay_Video_Pitch_Script   # pitch video script (docx/pdf)
└── README.md
```

## Roadmap

- [ ] Real backend (API + PostgreSQL + Redis)
- [ ] Live Twilio SMS integration
- [ ] Phone-OTP patient login
- [ ] Facility admin dashboard (staff accounts, department hours, analytics)
- [ ] Multi-facility onboarding
- [ ] Hindi + regional language support
- [ ] Payments, insurance, EMR integration *(explicitly out of scope for MVP)*

## Impact

**70,000+** hospitals and clinics across India could run on this instead of a phone line — directly deployable across India's government and private healthcare network, with the same architecture extending to banks, RTOs, and other public service counters.

---

*Built for PS-032 · Digital Queue & Appointment Management Platform*
