# Canaray Website — Proof-of-Concept Demo

Standalone front-end prototype demonstrating a redesigned Canaray digital experience for dentists, dental offices, patients, and staff.

**Not connected to Canaray production systems.** All patients, reports, appointments, and authentication are fictional mock data.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) (ports 3000/3001 are reserved for other projects).

## Demo walkthrough

1. Land on the redesigned homepage
2. Sign in as **Dr. Sarah Chen** (dentist)
3. Review the dashboard (reports ready, upcoming visits, activity)
4. Create a referral (progress autosaves)
5. Book an appointment
6. Open case `case-001` (Aisha Rahman)
7. View the radiographic report
8. Open the interactive 3D viewer
9. Messages → attach a file (name it with `fail` to demo retry)
10. Consent form — resize/rotate to verify signature alignment

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run start`| Serve production build   |
| `npm run lint` | ESLint                   |

## Stack

Next.js (App Router) · React 19 · TypeScript · Tailwind CSS 4
