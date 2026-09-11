"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert, Badge, EmptyState } from "@/components/ui/Badge";
import {
  formatDateTime,
  getCase,
  getPatient,
  getReport,
  getService,
  patientName,
} from "@/lib/mock-data";
import { delay } from "@/lib/storage";

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const report = getReport(params.id);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!report) {
    return (
      <EmptyState
        title="Report not found"
        description="Open a ready report from the dashboard or a case page."
        action={
          <Link href="/app">
            <Button>Dashboard</Button>
          </Link>
        }
      />
    );
  }

  const caseRecord = getCase(report.caseId);
  const patient = caseRecord ? getPatient(caseRecord.patientId) : undefined;
  const service = caseRecord ? getService(caseRecord.serviceId) : undefined;

  async function downloadPdf() {
    setDownloading(true);
    await delay(700);
    setDownloading(false);
    setDownloaded(true);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href={`/app/cases/${report.caseId}`} className="text-sm font-medium text-accent">
            ← Back to case
          </Link>
          <h1 className="mt-2 font-display text-3xl text-ink">{report.title}</h1>
          <p className="mt-2 text-sm text-muted">
            {patient ? patientName(patient) : "Patient"} · {service?.name} ·{" "}
            {formatDateTime(report.completedAt)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="success">Report ready</Badge>
            <Badge>Demo content</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {caseRecord?.has3D ? (
            <Link href={`/app/viewer/${report.caseId}`}>
              <Button>Open interactive 3D</Button>
            </Link>
          ) : null}
          <Button variant="secondary" onClick={downloadPdf} disabled={downloading}>
            {downloading ? "Preparing PDF…" : downloaded ? "PDF ready (demo)" : "Download PDF"}
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              await delay(200);
              alert("Share link copied (demo).");
            }}
          >
            Share
          </Button>
        </div>
      </div>

      {downloaded ? (
        <Alert tone="success" title="PDF prepared">
          In production this would download the radiologist PDF. Here it demonstrates a clear
          success state.
        </Alert>
      ) : null}

      <article className="surface overflow-hidden">
        <header className="border-b border-line bg-background px-5 py-4 sm:px-8">
          <p className="text-sm font-semibold text-ink">{report.radiologist}</p>
          <p className="text-xs text-muted">Oral & Maxillofacial Radiology · FRCD(C)</p>
        </header>

        <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Summary</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">{report.summary}</p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Findings</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              {report.findings.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl bg-accent-soft/60 px-4 py-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-accent-deep">
              Impression
            </h2>
            <p className="mt-2 text-base font-medium leading-relaxed text-ink">{report.impression}</p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Recommendations
            </h2>
            <ul className="mt-3 space-y-2">
              {report.recommendations.map((r) => (
                <li key={r} className="flex gap-2 text-sm text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Related images
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-[radial-gradient(circle_at_35%_35%,#2aa8b0,#0b1f33)]"
                  role="img"
                  aria-label={`Related demo image ${i + 1}`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">Placeholder imagery for demo purposes only.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
