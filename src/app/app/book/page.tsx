"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { Alert, Badge } from "@/components/ui/Badge";
import {
  LOCATIONS,
  PATIENTS,
  SERVICES,
  formatCurrency,
  formatDateTime,
  getAvailableSlots,
  getLocation,
  getPatient,
  getService,
  patientName,
} from "@/lib/mock-data";
import { delay, loadJSON, saveJSON } from "@/lib/storage";
import type { BookingDraft } from "@/lib/types";

const STEPS = ["Patient", "Service", "Location", "Time", "Confirm"];

const empty: BookingDraft = {
  patientId: null,
  serviceId: null,
  locationId: null,
  slotId: null,
  step: 0,
};

export default function BookPage() {
  const [draft, setDraft] = useState<BookingDraft>(empty);
  const [hydrated, setHydrated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionBanner, setSessionBanner] = useState(true);

  useEffect(() => {
    setDraft(loadJSON("bookingDraft", empty));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || done) return;
    saveJSON("bookingDraft", draft);
  }, [draft, hydrated, done]);

  const slots = useMemo(
    () => (draft.locationId ? getAvailableSlots(draft.locationId) : []),
    [draft.locationId],
  );
  const patient = draft.patientId ? getPatient(draft.patientId) : undefined;
  const service = draft.serviceId ? getService(draft.serviceId) : undefined;
  const location = draft.locationId ? getLocation(draft.locationId) : undefined;
  const slot = slots.find((s) => s.id === draft.slotId);

  function update(patch: Partial<BookingDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (draft.step === 0 && !draft.patientId) e.patient = "Select a patient.";
    if (draft.step === 1 && !draft.serviceId) e.service = "Select a service.";
    if (draft.step === 2 && !draft.locationId) e.location = "Select a location.";
    if (draft.step === 3) {
      if (!draft.slotId) e.slot = "Select a time.";
      else if (slot && !slot.available) e.slot = "That slot is unavailable. Pick another time.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function confirm() {
    if (!validate()) return;
    setSubmitting(true);
    await delay(800);
    setSubmitting(false);
    setDone(true);
    saveJSON("bookingDraft", empty);
  }

  if (!hydrated) return <div className="skeleton h-80 w-full" />;

  if (done) {
    return (
      <div className="mx-auto max-w-lg animate-fade-up space-y-5 py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-2xl text-success">
          ✓
        </div>
        <h1 className="font-display text-3xl text-ink">Appointment booked</h1>
        <p className="text-muted">
          {patient ? patientName(patient) : "Patient"} is confirmed
          {slot ? ` for ${formatDateTime(slot.datetime)}` : ""}
          {location ? ` at ${location.name}` : ""}.
        </p>
        <Alert tone="success" title="Booking succeeded">
          Your session stayed active and progress was preserved through confirmation.
        </Alert>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/app">
            <Button>Dashboard</Button>
          </Link>
          <Link href="/app/consent">
            <Button variant="secondary">Open consent form</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-up">
      <div>
        <p className="text-sm font-medium text-accent">Appointments</p>
        <h1 className="mt-1 font-display text-3xl text-ink">Book an appointment</h1>
        <p className="mt-2 text-sm text-muted">
          Simple booking with saved progress — designed so you never lose a mid-flow session.
        </p>
      </div>

      {sessionBanner ? (
        <Alert tone="accent" title="Session protected in this demo">
          Progress autosaves locally. You can refresh mid-booking without losing selections.{" "}
          <button
            type="button"
            className="font-semibold underline"
            onClick={() => setSessionBanner(false)}
          >
            Dismiss
          </button>
        </Alert>
      ) : null}

      <Stepper steps={STEPS} current={draft.step} />

      <div className="surface p-5 sm:p-6">
        {draft.step === 0 && (
          <Chooser
            error={errors.patient}
            items={PATIENTS.map((p) => ({
              id: p.id,
              title: patientName(p),
              subtitle: `${p.chartNumber} · ${p.phone}`,
            }))}
            selected={draft.patientId}
            onSelect={(id) => update({ patientId: id })}
          />
        )}
        {draft.step === 1 && (
          <Chooser
            error={errors.service}
            items={SERVICES.map((s) => ({
              id: s.id,
              title: s.name,
              subtitle: `${s.shortDescription} · from ${formatCurrency(s.basePrice)}`,
            }))}
            selected={draft.serviceId}
            onSelect={(id) => update({ serviceId: id })}
          />
        )}
        {draft.step === 2 && (
          <Chooser
            error={errors.location}
            items={LOCATIONS.map((l) => ({
              id: l.id,
              title: l.name,
              subtitle: `${l.address}, ${l.city}`,
            }))}
            selected={draft.locationId}
            onSelect={(id) => update({ locationId: id, slotId: null })}
          />
        )}
        {draft.step === 3 && (
          <div className="space-y-3">
            {errors.slot ? (
              <p role="alert" className="text-xs text-danger">
                {errors.slot}
              </p>
            ) : null}
            <div className="grid gap-2 sm:grid-cols-2">
              {slots.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  disabled={!s.available}
                  onClick={() => update({ slotId: s.id })}
                  className={`rounded-xl border px-3 py-3 text-left text-sm disabled:opacity-40 ${
                    draft.slotId === s.id
                      ? "border-accent bg-accent-soft font-semibold"
                      : "border-line"
                  }`}
                >
                  {formatDateTime(s.datetime)}
                </button>
              ))}
            </div>
          </div>
        )}
        {draft.step === 4 && (
          <div className="space-y-3 text-sm">
            <Row label="Patient" value={patient ? patientName(patient) : "—"} />
            <Row label="Service" value={service?.name ?? "—"} />
            <Row label="Location" value={location?.name ?? "—"} />
            <Row label="Time" value={slot ? formatDateTime(slot.datetime) : "—"} />
            <Row label="Estimate" value={service ? formatCurrency(service.basePrice) : "—"} />
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button
          variant="secondary"
          disabled={draft.step === 0}
          onClick={() => update({ step: draft.step - 1 })}
        >
          Back
        </Button>
        {draft.step < STEPS.length - 1 ? (
          <Button
            onClick={() => {
              if (validate()) update({ step: draft.step + 1 });
            }}
          >
            Continue
          </Button>
        ) : (
          <Button onClick={confirm} disabled={submitting}>
            {submitting ? "Confirming…" : "Confirm booking"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Chooser({
  items,
  selected,
  onSelect,
  error,
}: {
  items: { id: string; title: string; subtitle: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      {error ? (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : null}
      <ul className="max-h-80 space-y-2 overflow-auto">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left ${
                selected === item.id ? "border-accent bg-accent-soft" : "border-line"
              }`}
            >
              <span>
                <span className="block text-sm font-semibold">{item.title}</span>
                <span className="text-xs text-muted">{item.subtitle}</span>
              </span>
              {selected === item.id ? <Badge tone="accent">Selected</Badge> : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-background px-3 py-2.5">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
