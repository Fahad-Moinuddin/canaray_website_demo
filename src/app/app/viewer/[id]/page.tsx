"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, EmptyState } from "@/components/ui/Badge";
import {
  getCase,
  getPatient,
  getReport,
  getService,
  patientName,
} from "@/lib/mock-data";

type Mode = "volume" | "axial" | "panoramic";

export default function ViewerPage() {
  const params = useParams<{ id: string }>();
  const caseRecord = getCase(params.id);
  const stageRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>("volume");
  const [rotation, setRotation] = useState({ x: -18, y: 32 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{
    active: boolean;
    ox: number;
    oy: number;
    mode: "rotate" | "pan";
  }>({ active: false, ox: 0, oy: 0, mode: "rotate" });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const isPan = e.shiftKey || e.button === 1;
    drag.current = {
      active: true,
      ox: e.clientX,
      oy: e.clientY,
      mode: isPan ? "pan" : "rotate",
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.ox;
    const dy = e.clientY - drag.current.oy;
    drag.current.ox = e.clientX;
    drag.current.oy = e.clientY;
    if (drag.current.mode === "pan") {
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    } else {
      setRotation((r) => ({
        x: Math.max(-60, Math.min(60, r.x - dy * 0.4)),
        y: r.y + dx * 0.5,
      }));
    }
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current.active = false;
  }, []);

  if (!caseRecord || !caseRecord.has3D) {
    return (
      <EmptyState
        title="3D viewer unavailable"
        description="This case does not have an interactive volume in the demo, or the ID is invalid."
        action={
          <Link href="/app">
            <Button>Dashboard</Button>
          </Link>
        }
      />
    );
  }

  const patient = getPatient(caseRecord.patientId);
  const service = getService(caseRecord.serviceId);
  const report = caseRecord.reportId ? getReport(caseRecord.reportId) : undefined;

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href={`/app/cases/${caseRecord.id}`} className="text-sm font-medium text-accent">
            ← Case
          </Link>
          <h1 className="mt-1 font-display text-2xl text-ink sm:text-3xl">
            Interactive 3D viewer
          </h1>
          <p className="text-sm text-muted">
            {patient ? patientName(patient) : "Patient"} · {service?.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="warning">Demo visualization</Badge>
          {report ? (
            <Link href={`/app/reports/${report.id}`}>
              <Button size="sm" variant="secondary">
                Open report
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="overflow-hidden rounded-2xl border border-line bg-[#071421] shadow-[var(--shadow-md)]">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2">
            {(
              [
                ["volume", "3D volume"],
                ["axial", "Axial"],
                ["panoramic", "Panoramic"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  mode === id ? "bg-accent text-white" : "text-white/70 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
            <div className="ml-auto flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setZoom((z) => Math.min(2.4, z + 0.15))}
              >
                Zoom +
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              >
                Zoom −
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => {
                  setRotation({ x: -18, y: 32 });
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          <div
            ref={stageRef}
            className="relative aspect-[16/11] cursor-grab touch-none active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={(e) => {
              e.preventDefault();
              setZoom((z) => Math.max(0.6, Math.min(2.4, z - e.deltaY * 0.0015)));
            }}
            role="img"
            aria-label="Mock interactive dental volume. Drag to rotate, shift-drag to pan, scroll to zoom."
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,127,134,0.25),transparent_65%)]" />

            {mode === "volume" && (
              <div
                className="absolute left-1/2 top-1/2 h-56 w-56 sm:h-72 sm:w-72"
                style={{
                  transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                  transformStyle: "preserve-3d",
                  transition: drag.current.active ? "none" : "transform 0.05s linear",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full border border-teal-200/30"
                  style={{ transform: "rotateX(70deg)" }}
                />
                <div
                  className="absolute inset-[12%] rounded-full border border-white/20 bg-gradient-to-br from-teal-300/20 to-transparent"
                  style={{ transform: "rotateX(70deg) translateZ(12px)" }}
                />
                <div
                  className="absolute left-[28%] top-[34%] h-24 w-16 rounded-[40%] border border-teal-100/50 bg-teal-200/15"
                  style={{ transform: "translateZ(28px) rotateZ(-18deg)" }}
                />
                <div
                  className="absolute left-[48%] top-[30%] h-28 w-14 rounded-[40%] border border-cyan-100/40 bg-cyan-200/10"
                  style={{ transform: "translateZ(36px) rotateZ(8deg)" }}
                />
                <div
                  className="absolute left-[38%] top-[48%] h-3 w-20 rounded-full bg-amber-300/50 blur-[0.5px]"
                  style={{ transform: "translateZ(44px) rotateZ(-6deg)" }}
                  title="Highlighted canal (demo)"
                />
                <div
                  className="absolute inset-[30%] rounded-full bg-white/10 blur-md"
                  style={{ transform: "translateZ(8px)" }}
                />
              </div>
            )}

            {mode === "axial" && (
              <div
                className="absolute inset-8 rounded-xl border border-white/10 bg-[#0a1a28]"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                }}
              >
                <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-teal-200/40" />
                <div className="absolute left-[42%] top-[46%] h-8 w-12 rounded-full border border-amber-200/60 bg-amber-200/20" />
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
              </div>
            )}

            {mode === "panoramic" && (
              <div
                className="absolute inset-6 flex items-center justify-center"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                }}
              >
                <svg viewBox="0 0 400 160" className="h-full w-full text-teal-100/70">
                  <path
                    d="M20 100 Q100 20 200 40 T380 90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    d="M40 110 Q120 50 200 60 T360 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  {[80, 120, 160, 200, 240, 280, 320].map((x, i) => (
                    <rect
                      key={x}
                      x={x}
                      y={55 + (i % 3) * 4}
                      width="14"
                      height="36"
                      rx="3"
                      fill="currentColor"
                      opacity={0.35 + (i % 4) * 0.1}
                    />
                  ))}
                  <circle cx="250" cy="78" r="10" fill="#fbbf24" opacity="0.7" />
                </svg>
              </div>
            )}

            <p className="pointer-events-none absolute bottom-3 left-3 right-3 text-xs text-white/50">
              Drag to rotate · Shift-drag to pan · Scroll to zoom · Not clinical imagery
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="surface p-4">
            <h2 className="text-sm font-semibold text-ink">Case information</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Patient</dt>
                <dd className="font-medium">{patient ? patientName(patient) : "—"}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Modality</dt>
                <dd className="font-medium">CBCT</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Images</dt>
                <dd className="font-medium">{caseRecord.imageCount}</dd>
              </div>
            </dl>
          </div>
          {report ? (
            <div className="surface p-4">
              <h2 className="text-sm font-semibold text-ink">Report highlight</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted">{report.impression}</p>
              <Link href={`/app/reports/${report.id}`} className="mt-3 inline-block">
                <Button size="sm" variant="soft" fullWidth>
                  Full report
                </Button>
              </Link>
            </div>
          ) : null}
          <div className="surface p-4">
            <h2 className="text-sm font-semibold text-ink">Image navigation</h2>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="aspect-square rounded-lg bg-[radial-gradient(circle_at_30%_30%,#0b7f86,#0b1f33)] ring-offset-2 hover:ring-2 hover:ring-accent"
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
