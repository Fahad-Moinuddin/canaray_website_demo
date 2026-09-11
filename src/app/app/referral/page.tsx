"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Stepper } from "@/components/ui/Stepper";
import { Alert, Badge } from "@/components/ui/Badge";
import {
  INDICATIONS,
  LOCATIONS,
  PATIENTS,
  SERVICES,
  formatCurrency,
  formatDateTime,
  getAvailableSlots,
  getIndication,
  getLocation,
  getPatient,
  getService,
  patientName,
} from "@/lib/mock-data";
import { loadJSON, saveJSON, delay } from "@/lib/storage";
import type { ReferralDraft } from "@/lib/types";

const STEPS = ["Patient", "Service", "Indication", "Location", "Appointment", "Review"];

const emptyDraft: ReferralDraft = {
  patientId: null,
  serviceId: null,
  indicationId: null,
  locationId: null,
  slotId: null,
  notes: "",
  step: 0,
};

export default function ReferralPage() {
  const [draft, setDraft] = useState<ReferralDraft>(emptyDraft);
  const [hydrated, setHydrated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
  });

  useEffect(() => {
    const saved = loadJSON<ReferralDraft>("referralDraft", emptyDraft);
    setDraft(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || submitted) return;
    saveJSON("referralDraft", draft);
  }, [draft, hydrated, submitted]);

  const update = useCallback((patch: Partial<ReferralDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setErrors({});
  }, []);

  const slots = useMemo(
    () => (draft.locationId ? getAvailableSlots(draft.locationId) : []),
    [draft.locationId],
  );

  const indications = useMemo(
    () => INDICATIONS.filter((i) => i.serviceId === draft.serviceId),
    [draft.serviceId],
  );

  const service = draft.serviceId ? getService(draft.serviceId) : undefined;
  const patient = draft.patientId ? getPatient(draft.patientId) : undefined;
  const location = draft.locationId ? getLocation(draft.locationId) : undefined;
  const indication = draft.indicationId ? getIndication(draft.indicationId) : undefined;
  const slot = slots.find((s) => s.id === draft.slotId);

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (draft.step === 0) {
      if (createMode) {
        if (!newPatient.firstName.trim()) e.firstName = "First name is required.";
        if (!newPatient.lastName.trim()) e.lastName = "Last name is required.";
        if (!newPatient.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
      } else if (!draft.patientId) {
        e.patientId = "Select a patient to continue.";
      }
    }
    if (draft.step === 1 && !draft.serviceId) e.serviceId = "Select a service.";
    if (draft.step === 2 && indications.length > 0 && !draft.indicationId) {
      e.indicationId = "Select a clinical reason.";
    }
    if (draft.step === 3 && !draft.locationId) e.locationId = "Choose a location.";
    if (draft.step === 4) {
      if (!draft.slotId) e.slotId = "Select an available time.";
      else if (slot && !slot.available) e.slotId = "That time is no longer available. Choose another.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function next() {
    if (!validateStep()) return;
    if (draft.step === 0 && createMode) {
      update({
        patientId: "pt-new-demo",
        newPatient: { ...newPatient, email: "", chartNumber: "HV-NEW" },
      });
    }
    if (draft.step < STEPS.length - 1) update({ step: draft.step + 1 });
  }

  function back() {
    if (draft.step > 0) update({ step: draft.step - 1 });
  }

  async function submit() {
    if (!validateStep()) return;
    setSubmitting(true);
    await delay(900);
    setSubmitting(false);
    setSubmitted(true);
    saveJSON("referralDraft", emptyDraft);
  }

  if (!hydrated) {
    return <div className="skeleton h-96 w-full" />;
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg animate-fade-up space-y-6 py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-2xl text-success">
          ✓
        </div>
        <h1 className="font-display text-3xl text-ink">Referral submitted</h1>
        <p className="text-muted">
          {patient
            ? `${patientName(patient)}`
            : `${newPatient.firstName} ${newPatient.lastName}`}{" "}
          is scheduled
          {slot ? ` for ${formatDateTime(slot.datetime)}` : ""}. A confirmation was added to the
          demo dashboard.
        </p>
        <Alert tone="success" title="Nothing was lost">
          Your referral details were kept through every step — including if you refreshed the page.
        </Alert>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/app">
            <Button>Back to dashboard</Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => {
              setDraft(emptyDraft);
              setSubmitted(false);
              setCreateMode(false);
            }}
          >
            Create another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-up">
      <div>
        <p className="text-sm font-medium text-accent">Referral</p>
        <h1 className="mt-1 font-display text-3xl text-ink">Make a referral</h1>
        <p className="mt-2 text-sm text-muted">
          Guided steps — your progress is saved automatically in this browser.
        </p>
      </div>

      <Stepper steps={STEPS} current={draft.step} />

      <div className="surface p-5 sm:p-6">
        {draft.step === 0 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={!createMode ? "primary" : "secondary"}
                onClick={() => setCreateMode(false)}
              >
                Existing patient
              </Button>
              <Button
                size="sm"
                variant={createMode ? "primary" : "secondary"}
                onClick={() => setCreateMode(true)}
              >
                New patient
              </Button>
            </div>
            {!createMode ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-ink">Select patient</p>
                {errors.patientId ? (
                  <p role="alert" className="text-xs text-danger">
                    {errors.patientId}
                  </p>
                ) : null}
                <ul className="max-h-72 space-y-2 overflow-auto">
                  {PATIENTS.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => update({ patientId: p.id })}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left ${
                          draft.patientId === p.id
                            ? "border-accent bg-accent-soft"
                            : "border-line hover:border-line-strong"
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-semibold">{patientName(p)}</span>
                          <span className="text-xs text-muted">
                            DOB {p.dateOfBirth} · {p.chartNumber}
                          </span>
                        </span>
                        {draft.patientId === p.id ? <Badge tone="accent">Selected</Badge> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" htmlFor="fn" error={errors.firstName}>
                  <Input
                    id="fn"
                    value={newPatient.firstName}
                    error={errors.firstName}
                    onChange={(e) => setNewPatient((p) => ({ ...p, firstName: e.target.value }))}
                  />
                </Field>
                <Field label="Last name" htmlFor="ln" error={errors.lastName}>
                  <Input
                    id="ln"
                    value={newPatient.lastName}
                    error={errors.lastName}
                    onChange={(e) => setNewPatient((p) => ({ ...p, lastName: e.target.value }))}
                  />
                </Field>
                <Field label="Date of birth" htmlFor="dob" error={errors.dateOfBirth}>
                  <Input
                    id="dob"
                    type="date"
                    value={newPatient.dateOfBirth}
                    error={errors.dateOfBirth}
                    onChange={(e) => setNewPatient((p) => ({ ...p, dateOfBirth: e.target.value }))}
                  />
                </Field>
                <Field label="Phone" htmlFor="phone">
                  <Input
                    id="phone"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient((p) => ({ ...p, phone: e.target.value }))}
                  />
                </Field>
              </div>
            )}
          </div>
        )}

        {draft.step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-ink">What imaging do you need?</p>
            {errors.serviceId ? (
              <p role="alert" className="text-xs text-danger">
                {errors.serviceId}
              </p>
            ) : null}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">CBCT</p>
              {SERVICES.filter((s) => s.category === "cbct").map((s) => (
                <ServiceOption
                  key={s.id}
                  selected={draft.serviceId === s.id}
                  title={s.name}
                  description={s.whyChoose}
                  meta={`${s.typicalDuration} · from ${formatCurrency(s.basePrice)}`}
                  onSelect={() => update({ serviceId: s.id, indicationId: null })}
                />
              ))}
              <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Other services
              </p>
              {SERVICES.filter((s) => s.category === "other").map((s) => (
                <ServiceOption
                  key={s.id}
                  selected={draft.serviceId === s.id}
                  title={s.name}
                  description={s.shortDescription}
                  meta={`${s.typicalDuration} · from ${formatCurrency(s.basePrice)}`}
                  onSelect={() => update({ serviceId: s.id, indicationId: null })}
                />
              ))}
            </div>
          </div>
        )}

        {draft.step === 2 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-ink">Clinical reason</p>
            <p className="text-sm text-muted">
              Helps Canaray protocol the scan correctly — keep it simple.
            </p>
            {indications.length === 0 ? (
              <Alert tone="accent" title="No specific indication required">
                Continue to choose a location for {service?.name}.
              </Alert>
            ) : (
              <>
                {errors.indicationId ? (
                  <p role="alert" className="text-xs text-danger">
                    {errors.indicationId}
                  </p>
                ) : null}
                <ul className="space-y-2">
                  {indications.map((i) => (
                    <li key={i.id}>
                      <button
                        type="button"
                        onClick={() => update({ indicationId: i.id })}
                        className={`w-full rounded-xl border px-4 py-3 text-left ${
                          draft.indicationId === i.id
                            ? "border-accent bg-accent-soft"
                            : "border-line hover:border-line-strong"
                        }`}
                      >
                        <span className="block text-sm font-semibold">{i.label}</span>
                        <span className="text-xs text-muted">{i.description}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <Field label="Notes for Canaray (optional)" htmlFor="notes">
              <Textarea
                id="notes"
                value={draft.notes}
                placeholder="Relevant history, tooth numbers, special requests…"
                onChange={(e) => update({ notes: e.target.value })}
              />
            </Field>
          </div>
        )}

        {draft.step === 3 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink">Choose a location</p>
            {errors.locationId ? (
              <p role="alert" className="text-xs text-danger">
                {errors.locationId}
              </p>
            ) : null}
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => update({ locationId: loc.id, slotId: null })}
                className={`w-full rounded-xl border px-4 py-3 text-left ${
                  draft.locationId === loc.id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:border-line-strong"
                }`}
              >
                <span className="block text-sm font-semibold">{loc.name}</span>
                <span className="block text-xs text-muted">
                  {loc.address}, {loc.city}
                </span>
                <span className="mt-1 block text-xs text-ink-soft">{loc.hours}</span>
              </button>
            ))}
          </div>
        )}

        {draft.step === 4 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink">Available times</p>
            {errors.slotId ? (
              <p role="alert" className="text-xs text-danger">
                {errors.slotId}
              </p>
            ) : null}
            <div className="grid gap-2 sm:grid-cols-2">
              {slots.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  disabled={!s.available}
                  onClick={() => update({ slotId: s.id })}
                  className={`rounded-xl border px-3 py-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
                    draft.slotId === s.id
                      ? "border-accent bg-accent-soft font-semibold"
                      : "border-line hover:border-line-strong"
                  }`}
                >
                  {formatDateTime(s.datetime)}
                  {!s.available ? (
                    <span className="mt-1 block text-xs text-danger">Unavailable</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        )}

        {draft.step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-ink">Review & confirm</h2>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <ReviewItem
                label="Patient"
                value={
                  patient
                    ? patientName(patient)
                    : `${newPatient.firstName} ${newPatient.lastName}`
                }
              />
              <ReviewItem label="Service" value={service?.name ?? "—"} />
              <ReviewItem label="Indication" value={indication?.label ?? "—"} />
              <ReviewItem label="Location" value={location?.name ?? "—"} />
              <ReviewItem
                label="Appointment"
                value={slot ? formatDateTime(slot.datetime) : "—"}
              />
              <ReviewItem
                label="Estimated price"
                value={service ? formatCurrency(service.basePrice) : "—"}
              />
            </dl>
            {draft.notes ? (
              <p className="rounded-xl bg-background px-3 py-2 text-sm text-ink-soft">
                <span className="font-semibold text-ink">Notes: </span>
                {draft.notes}
              </p>
            ) : null}
            <Alert tone="accent" title="Demo pricing">
              Amounts are illustrative mock estimates for this proof of concept.
            </Alert>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={back} disabled={draft.step === 0}>
          Back
        </Button>
        {draft.step < STEPS.length - 1 ? (
          <Button onClick={next}>Continue</Button>
        ) : (
          <Button onClick={submit} disabled={submitting}>
            {submitting ? "Submitting…" : "Confirm referral"}
          </Button>
        )}
      </div>
    </div>
  );
}

function ServiceOption({
  selected,
  title,
  description,
  meta,
  onSelect,
}: {
  selected: boolean;
  title: string;
  description: string;
  meta: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border px-4 py-3 text-left ${
        selected ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong"
      }`}
    >
      <span className="block text-sm font-semibold text-ink">{title}</span>
      <span className="mt-0.5 block text-xs text-muted">{description}</span>
      <span className="mt-1 block text-xs font-medium text-ink-soft">{meta}</span>
    </button>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background px-3 py-2.5">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink">{value}</dd>
    </div>
  );
}
