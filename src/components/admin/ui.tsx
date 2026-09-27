import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";

export function AdminPageHeader({
  title,
  description,
  addHref,
  addLabel,
}: {
  title: string;
  description?: string;
  addHref?: string;
  addLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {addHref && addLabel && (
        <Link
          href={addHref}
          className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-sm font-bold px-3 py-2 rounded-lg shadow active:scale-95 transition-transform"
        >
          <Plus className="size-4" />
          {addLabel}
        </Link>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  emoji,
  tone,
}: {
  label: string;
  value: string | number;
  emoji: string;
  tone?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3 shadow-sm flex items-center gap-3",
        tone || "bg-card border-border"
      )}
    >
      <div className="text-2xl">{emoji}</div>
      <div>
        <div className="text-2xl font-extrabold tabular-nums">
          {typeof value === "number" ? value.toLocaleString("fa-IR") : value}
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export function AdminBadge({
  children,
  color = "bg-muted text-foreground",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-bold px-2 py-0.5 rounded-md",
        color
      )}
    >
      {children}
    </span>
  );
}

export function AdminButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "sm",
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = cn(
    "inline-flex items-center gap-1 font-bold rounded-lg transition-all active:scale-95",
    size === "sm" ? "text-xs px-2.5 py-1.5" : "text-sm px-3 py-2",
    variant === "primary" && "bg-primary text-primary-foreground shadow",
    variant === "outline" && "border border-border bg-card text-foreground hover:bg-muted",
    variant === "ghost" && "text-foreground hover:bg-muted",
    variant === "danger" && "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200",
    variant === "success" && "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200",
    disabled && "opacity-50 cursor-not-allowed"
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function BackLink({ href = "/admin", label = "بازگشت" }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-primary font-bold mb-4 hover:underline"
    >
      <ChevronLeft className="size-4" />
      {label}
    </Link>
  );
}

export function EmptyState({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <div className="text-5xl mb-2">{emoji}</div>
      <p className="text-sm font-bold">{title}</p>
      {description && (
        <p className="text-xs mt-1 max-w-sm mx-auto">{description}</p>
      )}
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-sm">
      {message}
    </div>
  );
}
