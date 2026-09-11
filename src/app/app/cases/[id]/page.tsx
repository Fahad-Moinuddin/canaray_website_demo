"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, EmptyState } from "@/components/ui/Badge";
import {
  ACTIVITY,
  MESSAGES,
  REPORTS,
  STATUS_LABELS,
  formatDateTime,
  getCase,
  getIndication,
  getLocation,
  getPatient,
  getService,
  patientName,
} from "@/lib/mock-data";

const TABS = ["Overview", "Reports", "Images", "Documents", "Messages", "Activity"] as const;

export default function CasePage() {
  const params = useParams<{ id: string }>();
  const caseRecord = getCase(params.id);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  if (!caseRecord) {
    return (
      <EmptyState
        title="Case not found"
        description="This demo case ID doesn't exist. Open a case from the dashboard."
        action={
          <Link href="/app">
            <Button>Back to dashboard</Button>
          </Link>
        }
      />
    );
  }

  const patient = getPatient(caseRecord.patientId);
  const service = getService(caseRecord.serviceId);
  const location = getLocation(caseRecord.locationId);
  const indication = caseRecord.indicationId
    ? getIndication(caseRecord.indicationId)
    : undefined;
  const report = REPORTS.find((r) => r.id === caseRecord.reportId);
  const caseActivity = ACTIVITY.filter((a) => a.caseId === caseRecord.id);
  const caseMessages = MESSAGES.filter((m) =>
    m.conversationId === "conv-001" && caseRecord.id === "case-001"
      ? true
      : m.conversationId === "conv-003" && caseRecord.id === "case-002",
  );

  const statusTone =
    caseRecord.status === "ready"
      ? "success"
      : caseRecord.status === "scheduled"
        ? "accent"
        : "neutral";

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href="/app" className="text-sm font-medium text-accent">
            ← Dashboard
          </Link>
          <h1 className="mt-2 font-display text-3xl text-ink">
            {patient ? patientName(patient) : "Patient"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {service?.name}
            {indication ? ` · ${indication.label}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone={statusTone}>{STATUS_LABELS[caseRecord.status]}</Badge>
            <Badge>{caseRecord.id}</Badge>
            {caseRecord.has3D ? <Badge tone="accent">3D available</Badge> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {report ? (
            <Link href={`/app/reports/${report.id}`}>
              <Button>Open report</Button>
            </Link>
          ) : null}
          {caseRecord.has3D ? (
            <Link href={`/app/viewer/${caseRecord.id}`}>
              <Button variant="soft">Open 3D viewer</Button>
            </Link>
          ) : null}
          <Link href="/app/messages">
            <Button variant="secondary">Message Canaray</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Meta label="Chart" value={patient?.chartNumber ?? "—"} />
        <Meta label="DOB" value={patient?.dateOfBirth ?? "—"} />
        <Meta label="Location" value={location?.name ?? "—"} />
      </div>

      <div className="border-b border-line">
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Case sections">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold ${
                tab === t
                  ? "border-accent text-accent-deep"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      <div className="surface p-5 sm:p-6">
        {tab === "Overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-base font-semibold text-ink">Case details</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Status" value={STATUS_LABELS[caseRecord.status]} />
                <Row label="Created" value={formatDateTime(caseRecord.createdAt)} />
                <Row label="Updated" value={formatDateTime(caseRecord.updatedAt)} />
                <Row label="Images" value={String(caseRecord.imageCount)} />
                <Row label="Documents" value={String(caseRecord.documentCount)} />
              </dl>
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink">Patient</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Phone" value={patient?.phone ?? "—"} />
                <Row label="Email" value={patient?.email ?? "—"} />
                <Row label="Indication" value={indication?.description ?? "—"} />
              </dl>
            </div>
          </div>
        )}

        {tab === "Reports" && (
          report ? (
            <div className="space-y-3">
              <h2 className="text-base font-semibold">{report.title}</h2>
              <p className="text-sm text-muted">
                {report.radiologist} · {formatDateTime(report.completedAt)}
              </p>
              <p className="text-sm text-ink-soft">{report.summary}</p>
              <Link href={`/app/reports/${report.id}`}>
                <Button className="mt-2">View full report</Button>
              </Link>
            </div>
          ) : (
            <EmptyState
              title="No report yet"
              description="Reporting begins after imaging is complete. You'll be notified when it's ready."
            />
          )
        )}

        {tab === "Images" && (
          caseRecord.imageCount > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: caseRecord.imageCount }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl border border-line bg-[radial-gradient(circle_at_40%_40%,#0b7f86_0%,#0b1f33_70%)] opacity-90"
                  role="img"
                  aria-label={`Demo image ${i + 1}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No images yet"
              description="Images appear here after the scan is completed at Canaray."
            />
          )
        )}

        {tab === "Documents" && (
          caseRecord.documentCount > 0 ? (
            <ul className="space-y-2">
              {Array.from({ length: caseRecord.documentCount }).map((_, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm"
                >
                  <span className="font-medium">
                    {i === 0 ? "Referral form.pdf" : "Consent signed.pdf"}
                  </span>
                  <Badge>Demo file</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No documents"
              description="Referral forms and consents will show up here."
            />
          )
        )}

        {tab === "Messages" && (
          caseMessages.length > 0 ? (
            <ul className="space-y-3">
              {caseMessages.map((m) => (
                <li key={m.id} className="rounded-xl bg-background px-4 py-3">
                  <p className="text-xs font-semibold text-muted">
                    {m.sender} · {formatDateTime(m.timestamp)}
                  </p>
                  <p className="mt-1 text-sm text-ink">{m.body}</p>
                </li>
              ))}
              <Link href="/app/messages">
                <Button size="sm" variant="secondary">
                  Open full inbox
                </Button>
              </Link>
            </ul>
          ) : (
            <EmptyState
              title="No messages on this case"
              description="Start a conversation from the Messages inbox."
              action={
                <Link href="/app/messages">
                  <Button size="sm">Go to messages</Button>
                </Link>
              }
            />
          )
        )}

        {tab === "Activity" && (
          caseActivity.length > 0 ? (
            <ul className="divide-y divide-line">
              {caseActivity.map((a) => (
                <li key={a.id} className="py-3">
                  <p className="text-sm font-semibold">{a.label}</p>
                  <p className="text-sm text-muted">{a.detail}</p>
                  <time className="text-xs text-muted">{formatDateTime(a.timestamp)}</time>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No activity yet"
              description="Status changes and updates will appear in this timeline."
            />
          )
        )}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-2">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
