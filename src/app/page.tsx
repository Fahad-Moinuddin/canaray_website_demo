import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";

const services = [
  {
    title: "CBCT imaging",
    copy: "Endodontics, implants, wisdom teeth, TMJ, pathology, and surgical planning — with clear guidance on what to order.",
  },
  {
    title: "Expert reports",
    copy: "Canadian-licensed oral and maxillofacial radiologists. Interactive 3D when you need it, PDF when you don’t.",
  },
  {
    title: "Records & guides",
    copy: "Panoramic, cephalometric, clinical photos, digital impressions, and surgical guides — coordinated in one place.",
  },
];

const steps = [
  {
    n: "01",
    title: "Refer or book",
    copy: "Select the patient, service, and indication in a few guided steps. Progress is saved as you go.",
  },
  {
    n: "02",
    title: "Scan at Canaray",
    copy: "Patients complete consent on any screen — including kiosk — and imaging is captured with care.",
  },
  {
    n: "03",
    title: "Review in 3D",
    copy: "Open the report, explore the interactive volume, and message Canaray without leaving the case.",
  },
];

const faqs = [
  {
    q: "Who is this demo for?",
    a: "Dentists, office staff, and patients exploring what a redesigned Canaray experience could feel like. All data is fictional.",
  },
  {
    q: "Is this connected to the real Canaray systems?",
    a: "No. This is a standalone proof of concept with mock authentication, patients, appointments, reports, and messaging.",
  },
  {
    q: "How do I try the workflows?",
    a: "Sign in as a demo dentist, explore the dashboard, create a referral, book an appointment, open a case, view a report, try the 3D viewer, and test messaging uploads.",
  },
  {
    q: "What about patient privacy?",
    a: "No real patient information is used. Names, charts, and reports in this demo are entirely fictional.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      {/* Hero — full bleed, brand first */}
      <section className="hero-atmosphere relative min-h-[100svh] overflow-hidden text-white">
        <div className="grid-fade pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:justify-center lg:pb-24 lg:pt-24">
          <div className="max-w-2xl">
            <p className="animate-fade-up font-display text-4xl tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Canaray
            </p>
            <h1 className="animate-fade-up-delay mt-5 max-w-xl text-2xl font-semibold leading-snug tracking-tight text-white/95 sm:text-3xl">
              Oral radiology that feels fast, clear, and reliable.
            </h1>
            <p className="animate-fade-up-delay-2 mt-4 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              Specialized CBCT, expert radiographic reporting, and interactive 3D —
              redesigned so dentists, offices, and patients always know what to do next.
            </p>
            <div className="animate-fade-up-delay-2 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  I&apos;m a dentist — sign in
                </Button>
              </Link>
              <Link href="/login?role=patient">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full border-white/25 bg-white/10 text-white hover:bg-white/15 sm:w-auto"
                >
                  I&apos;m a patient
                </Button>
              </Link>
            </div>
          </div>

          {/* Atmospheric imaging visual — edge-to-edge feel on large screens */}
          <div
            className="pointer-events-none absolute -right-8 top-1/2 hidden w-[48%] -translate-y-1/2 opacity-90 lg:block"
            aria-hidden
          >
            <div className="relative aspect-square max-w-xl">
              <div className="absolute inset-[12%] rounded-full border border-white/15" />
              <div className="absolute inset-[22%] rounded-full border border-white/20" />
              <div className="absolute inset-[34%] rounded-full border border-teal-200/30 bg-gradient-to-br from-teal-300/20 to-transparent" />
              <div className="absolute inset-[42%] rounded-full bg-gradient-to-br from-white/25 to-teal-400/10 blur-[1px]" />
              <div className="absolute left-1/2 top-[18%] h-16 w-px -translate-x-1/2 bg-white/30" />
              <div className="absolute bottom-[18%] left-1/2 h-16 w-px -translate-x-1/2 bg-white/30" />
              <div className="absolute left-[18%] top-1/2 h-px w-16 -translate-y-1/2 bg-white/30" />
              <div className="absolute right-[18%] top-1/2 h-px w-16 -translate-y-1/2 bg-white/30" />
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.6)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {[
            ["4,600+", "Dentists served"],
            ["450,000", "Reports delivered"],
            ["15 years", "Trusted reporting"],
            ["Interactive 3D", "Batteries included"],
          ].map(([stat, label]) => (
            <div key={label}>
              <p className="font-display text-2xl text-ink sm:text-3xl">{stat}</p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">How Canaray works</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl text-ink sm:text-4xl">
          Three steps from referral to clarity.
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <p className="font-display text-4xl text-accent/25">{s.n}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Services</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl text-ink sm:text-4xl">
            Imaging that matches the clinical question.
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Choose by clinical need — not by decoding a long technical menu.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="border-t border-accent/30 pt-5">
                <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/login">
              <Button>Explore referral flow</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3D */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
              Interactive 3D
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Reports you can explore — not just download.
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Open a finished case, read the radiologist&apos;s findings, then rotate, zoom, and
              inspect the volume. PDF reports remain available when you need a shareable copy.
            </p>
            <Link href="/login" className="mt-6 inline-block">
              <Button variant="soft">Try the 3D viewer demo</Button>
            </Link>
          </div>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-[#0b1f33] shadow-[var(--shadow-md)]"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(11,127,134,0.45),transparent_55%)]" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-200/40" />
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
            <div className="absolute left-[42%] top-[38%] h-16 w-20 -rotate-12 rounded-full border border-teal-100/50 bg-teal-200/10" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-white/60">
              <span>Demo visualization</span>
              <span>Rotate · Zoom · Pan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="for-dentists" className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
              For dentists & offices
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink">Less admin. More clinical signal.</h2>
            <ul className="mt-6 space-y-4 text-sm text-ink-soft">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Dashboard that answers “what do I need to do next?”
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Referral and booking flows that preserve progress
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Uploads that never fail silently — with retry
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Cases, reports, 3D, and messages in one place
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
              For patients
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink">Clear visits. Confident consent.</h2>
            <ul className="mt-6 space-y-4 text-sm text-ink-soft">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warm" />
                Simple appointment booking and instructions
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warm" />
                Consent forms that work on phone, tablet, and kiosk
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warm" />
                Signature area that stays aligned and usable
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl text-ink">FAQ</h2>
        <div className="mt-8 divide-y divide-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none text-base font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-muted transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-line bg-[#0b1f33] text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:py-20 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">See what Canaray could feel like.</h2>
            <p className="mt-3 max-w-lg text-white/70">
              Sign in with a demo account and walk through referral, booking, reports, 3D, and messaging.
            </p>
          </div>
          <Link href="/login">
            <Button size="lg">Enter the demo</Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
