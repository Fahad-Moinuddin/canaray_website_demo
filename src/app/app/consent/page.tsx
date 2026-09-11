"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Badge";
import { delay } from "@/lib/storage";

export default function ConsentPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [understood, setUnderstood] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ratio = window.devicePixelRatio || 1;
    const width = parent.clientWidth;
    const height = Math.max(180, Math.min(280, Math.round(width * 0.38)));
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#d7e0e8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, height - 36);
    ctx.lineTo(width - 24, height - 36);
    ctx.stroke();
    ctx.fillStyle = "#6b7f92";
    ctx.font = "12px sans-serif";
    ctx.fillText("Sign above the line", 24, height - 16);
    setHasSignature(false);
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
    };
  }, [resizeCanvas]);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawing.current = true;
    canvas.setPointerCapture(e.pointerId);
    const { x, y } = getPos(e);
    ctx.strokeStyle = "#0b1f33";
    ctx.lineWidth = 2.25;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function moveDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  }

  function endDraw() {
    drawing.current = false;
  }

  function clearSignature() {
    resizeCanvas();
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter the patient full name.";
    if (!dob) e.dob = "Date of birth is required.";
    if (!understood) e.understood = "Confirm that you understand before signing.";
    if (!hasSignature) e.signature = "A signature is required to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setSubmitting(true);
    await delay(900);
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg space-y-5 py-10 text-center animate-fade-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-2xl text-success">
          ✓
        </div>
        <h1 className="font-display text-3xl text-ink">Consent recorded</h1>
        <p className="text-muted">
          Thank you, {name}. In production this would sync to the appointment record.
        </p>
        <Alert tone="success" title="Signature captured cleanly">
          The signature pad stayed aligned across resize and orientation — addressing a known
          kiosk issue.
        </Alert>
        <Link href="/app">
          <Button>Return to dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-up">
      <div>
        <p className="text-sm font-medium text-accent">Patient intake</p>
        <h1 className="mt-1 font-display text-3xl text-ink">Imaging consent</h1>
        <p className="mt-2 text-sm text-muted">
          Optimized for desktop, tablet, and kiosk touchscreens. Large targets, stable signature
          area.
        </p>
      </div>

      <Alert tone="accent" title="Kiosk-ready demo">
        Rotate your device or resize the window — the signature canvas reflows and stays usable.
      </Alert>

      <form
        className="surface space-y-5 p-5 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        noValidate
      >
        <Field label="Patient full legal name" htmlFor="consent-name" error={errors.name}>
          <Input
            id="consent-name"
            autoComplete="name"
            value={name}
            error={errors.name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 text-base"
          />
        </Field>

        <Field label="Date of birth" htmlFor="consent-dob" error={errors.dob}>
          <Input
            id="consent-dob"
            type="date"
            value={dob}
            error={errors.dob}
            onChange={(e) => setDob(e.target.value)}
            className="h-12 text-base"
          />
        </Field>

        <div className="rounded-xl bg-background px-4 py-4 text-sm leading-relaxed text-ink-soft">
          <p className="font-semibold text-ink">Consent summary</p>
          <p className="mt-2">
            I consent to dental radiographic imaging (including CBCT where indicated) at Canaray.
            I understand that imaging uses ionizing radiation, that the examination will be
            performed by trained staff, and that a report may be provided to my referring dentist.
          </p>
          <p className="mt-2 text-xs text-muted">
            This is simplified demo copy — not a legal consent document.
          </p>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-line px-4 py-3">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 rounded border-line accent-[var(--accent)]"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
          />
          <span className="text-sm text-ink">
            I have read and understand this consent information.
            {errors.understood ? (
              <span role="alert" className="mt-1 block text-xs font-medium text-danger">
                {errors.understood}
              </span>
            ) : null}
          </span>
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="signature-pad" className="text-sm font-semibold text-ink">
              Signature
            </label>
            <Button type="button" size="sm" variant="ghost" onClick={clearSignature}>
              Clear
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border-2 border-line bg-white touch-none">
            <canvas
              id="signature-pad"
              ref={canvasRef}
              className="block w-full touch-none"
              style={{ touchAction: "none" }}
              onPointerDown={startDraw}
              onPointerMove={moveDraw}
              onPointerUp={endDraw}
              onPointerLeave={endDraw}
              onPointerCancel={endDraw}
              aria-label="Signature pad"
            />
          </div>
          {errors.signature ? (
            <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
              {errors.signature}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-muted">
              Use your finger, stylus, or mouse. Minimum touch target height ~180px.
            </p>
          )}
        </div>

        <Button type="submit" size="lg" fullWidth disabled={submitting} className="h-14 text-base">
          {submitting ? "Saving consent…" : "Sign & submit consent"}
        </Button>
      </form>
    </div>
  );
}
