"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, EmptyState } from "@/components/ui/Badge";
import { useAuth } from "@/context/auth-context";
import {
  ACTIVITY,
  APPOINTMENTS,
  CASES,
  CONVERSATIONS,
  REPORTS,
  STATUS_LABELS,
  formatDateTime,
  getPatient,
  getService,
  patientName,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const upcoming = APPOINTMENTS.filter((a) => a.status === "upcoming");
  const readyCases = CASES.filter((c) => c.status === "ready");
  const unread = CONVERSATIONS.reduce((n, c) => n + c.unread, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="skeleton h-28" />
          <div className="skeleton h-28" />
          <div className="skeleton h-28" />
        </div>
        <div className="skeleton h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent">Dashboard</p>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">
            Good day, {user?.name.split(" ").slice(-1)[0]}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Here&apos;s what needs your attention at {user?.practice || "Canaray"}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/referral">
            <Button>New referral</Button>
          </Link>
          <Link href="/app/book">
            <Button variant="secondary">Book appointment</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <PriorityCard
          label="Reports ready"
          value={String(readyCases.length)}
          hint="Review and open 3D"
          href={readyCases[0] ? `/app/cases/${readyCases[0].id}` : "/app"}
          tone="accent"
        />
        <PriorityCard
          label="Upcoming visits"
          value={String(upcoming.length)}
          hint="Next 7 days"
          href="/app/book"
          tone="neutral"
        />
        <PriorityCard
          label="Unread messages"
          value={String(unread)}
          hint="Office ↔ Canaray"
          href="/app/messages"
          tone={unread > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="surface p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Reports ready to review</h2>
            <Link href={readyCases[0] ? `/app/reports/${REPORTS[0].id}` : "#"} className="text-sm font-semibold text-accent">
              View all
            </Link>
          </div>
          {readyCases.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No reports waiting"
                description="When a radiologist finishes a report, it will appear here for review."
                action={
                  <Link href="/app/referral">
                    <Button size="sm">Create a referral</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {readyCases.map((c) => {
                const patient = getPatient(c.patientId);
                const service = getService(c.serviceId);
                const report = REPORTS.find((r) => r.id === c.reportId);
                return (
                  <li key={c.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-ink">
                        {patient ? patientName(patient) : "Patient"}
                      </p>
                      <p className="text-sm text-muted">
                        {service?.name} · {formatDateTime(c.updatedAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="success">{STATUS_LABELS[c.status]}</Badge>
                      {report ? (
                        <Link href={`/app/reports/${report.id}`}>
                          <Button size="sm">Open report</Button>
                        </Link>
                      ) : null}
                      <Link href={`/app/cases/${c.id}`}>
                        <Button size="sm" variant="secondary">
                          Case
                        </Button>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-ink">Upcoming appointments</h2>
          {upcoming.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No upcoming appointments"
                description="Book imaging for a patient to see visits here."
                action={
                  <Link href="/app/book">
                    <Button size="sm">Book now</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {upcoming.map((a) => {
                const patient = getPatient(a.patientId);
                const service = getService(a.serviceId);
                return (
                  <li key={a.id} className="rounded-xl border border-line bg-background px-3.5 py-3">
                    <p className="text-sm font-semibold text-ink">
                      {patient ? patientName(patient) : "Patient"}
                    </p>
                    <p className="text-xs text-muted">
                      {formatDateTime(a.datetime)}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">{service?.name}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <section className="surface p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Recent activity</h2>
          <Link href="/app/messages">
            <Button size="sm" variant="ghost">
              Messages
            </Button>
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {ACTIVITY.map((item) => (
            <li key={item.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{item.label}</p>
                <p className="text-sm text-muted">{item.detail}</p>
              </div>
              <div className="flex items-center gap-3">
                <time className="text-xs text-muted">{formatDateTime(item.timestamp)}</time>
                {item.caseId ? (
                  <Link href={`/app/cases/${item.caseId}`} className="text-xs font-semibold text-accent">
                    Open
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function PriorityCard({
  label,
  value,
  hint,
  href,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  href: string;
  tone: "accent" | "neutral" | "warning";
}) {
  const tones = {
    accent: "border-accent/20 bg-accent-soft/50",
    neutral: "border-line bg-surface",
    warning: "border-[#f0d9a0] bg-warning-soft",
  };
  return (
    <Link
      href={href}
      className={`rounded-2xl border p-5 transition-shadow hover:shadow-[var(--shadow-md)] ${tones[tone]}`}
    >
      <p className="text-sm font-medium text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-4xl text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </Link>
  );
}
