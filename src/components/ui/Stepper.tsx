interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={step} className="flex flex-1 items-center gap-3 sm:flex-col sm:items-stretch sm:gap-2">
              <div className="flex items-center gap-3 sm:w-full">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done
                      ? "bg-accent text-white"
                      : active
                        ? "bg-accent-soft text-accent-deep ring-2 ring-accent"
                        : "bg-background text-muted border border-line"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? "✓" : index + 1}
                </span>
                <span
                  className={`text-sm font-medium sm:hidden ${active ? "text-ink" : "text-muted"}`}
                >
                  {step}
                </span>
                {index < steps.length - 1 ? (
                  <div
                    className={`ml-1 hidden h-px flex-1 sm:block ${done ? "bg-accent" : "bg-line"}`}
                    aria-hidden
                  />
                ) : null}
              </div>
              <span
                className={`hidden text-xs font-medium sm:block ${active ? "text-ink" : "text-muted"}`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
