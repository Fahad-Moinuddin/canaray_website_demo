import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-muted">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ className = "", error, id, ...props }: InputProps) {
  return (
    <input
      id={id}
      aria-invalid={!!error}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={`h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink placeholder:text-muted transition-colors focus:border-accent ${error ? "border-danger" : "border-line"} ${className}`}
      {...props}
    />
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function Textarea({ className = "", error, id, ...props }: TextareaProps) {
  return (
    <textarea
      id={id}
      aria-invalid={!!error}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={`min-h-24 w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted transition-colors focus:border-accent ${error ? "border-danger" : "border-line"} ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export function Select({ className = "", error, id, children, ...props }: SelectProps) {
  return (
    <select
      id={id}
      aria-invalid={!!error}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={`h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors focus:border-accent ${error ? "border-danger" : "border-line"} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
