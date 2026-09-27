"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink, AdminBadge, AdminButton, AdminError } from "./ui";
import { Save, Loader2 } from "lucide-react";
import type { Sama137Request } from "@prisma/client";

const STATUS_OPTIONS = [
  { value: "pending", label: "در انتظار بررسی", badge: "bg-slate-100 text-slate-700" },
  { value: "in-progress", label: "در حال پیگیری", badge: "bg-amber-50 text-amber-700" },
  { value: "dispatched", label: "اعزام کارشناس", badge: "bg-sky-50 text-sky-700" },
  { value: "resolved", label: "حل‌شده", badge: "bg-emerald-50 text-emerald-700" },
  { value: "rejected", label: "رد شده", badge: "bg-rose-50 text-rose-700" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "کم", badge: "bg-slate-100 text-slate-700" },
  { value: "medium", label: "متوسط", badge: "bg-sky-50 text-sky-700" },
  { value: "high", label: "زیاد", badge: "bg-amber-50 text-amber-700" },
  { value: "urgent", label: "فوری", badge: "bg-rose-50 text-rose-700" },
];

export function SamaDetailClient({ request }: { request: Sama137Request }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(request.status);
  const [priority, setPriority] = useState(request.priority);
  const [assignedTo, setAssignedTo] = useState(request.assignedTo || "");
  const [referenceUnit, setReferenceUnit] = useState(request.referenceUnit || "");

  const statusOption = STATUS_OPTIONS.find((s) => s.value === status)!;
  const priorityOption = PRIORITY_OPTIONS.find((p) => p.value === priority)!;

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/sama137/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          statusLabel: statusOption.label,
          priority,
          priorityLabel: priorityOption.label,
          assignedTo,
          referenceUnit,
          updatedAt: new Date().toLocaleDateString("fa-IR"),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackLink href="/admin/sama137" label="بازگشت به درخواست‌های ۱۳۷" />

      <div className="bg-card border border-border/70 rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
            {request.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold">{request.title}</h1>
            <div className="text-xs text-muted-foreground mt-0.5">
              کد رهگیری: <span className="font-bold tabular-nums">{request.trackingCode}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <div className="text-[10px] text-muted-foreground">دسته‌بندی</div>
            <div className="text-sm font-bold">{request.categoryLabel}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">تاریخ ثبت</div>
            <div className="text-sm font-bold tabular-nums">{request.createdAt}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[10px] text-muted-foreground">آدرس</div>
            <div className="text-sm">{request.address}</div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border/60">
          <div className="text-[10px] text-muted-foreground mb-1">شرح مشکل</div>
          <p className="text-sm leading-relaxed">{request.description}</p>
        </div>
      </div>

      {/* فرم مدیریت */}
      <div className="bg-card border border-border/70 rounded-xl shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-bold mb-2">مدیریت درخواست</h2>

        <div>
          <label className="text-xs font-bold mb-1.5 block">وضعیت فعلی</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <AdminBadge color={statusOption.badge}>{statusOption.label}</AdminBadge>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold mb-1.5 block">اولویت</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <AdminBadge color={priorityOption.badge}>{priorityOption.label}</AdminBadge>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold mb-1.5 block">واحد مسئول</label>
          <input
            type="text"
            value={referenceUnit}
            onChange={(e) => setReferenceUnit(e.target.value)}
            placeholder="مثلاً واحد نظافت"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-bold mb-1.5 block">مسئول رسیدگی</label>
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="مثلاً مهندس رضایی"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {error && <AdminError message={error} />}

        <AdminButton onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              در حال ذخیره…
            </>
          ) : (
            <>
              <Save className="size-4" />
              ذخیره تغییرات
            </>
          )}
        </AdminButton>
      </div>

      {/* تایم‌لاین */}
      {request.timeline && (
        <div className="bg-card border border-border/70 rounded-xl shadow-sm p-4 mt-4">
          <h2 className="text-sm font-bold mb-3">مراحل پیگیری</h2>
          <ol className="space-y-0">
            {(JSON.parse(request.timeline) as { label: string; date: string; done: boolean }[]).map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`size-5 rounded-full flex items-center justify-center shrink-0 ${
                      step.done ? "bg-emerald-500 text-white" : "bg-muted border"
                    }`}
                  >
                    {step.done && "✓"}
                  </div>
                  {idx < JSON.parse(request.timeline).length - 1 && (
                    <div className={`w-0.5 flex-1 mt-1 mb-1 ${step.done ? "bg-emerald-500/50" : "bg-border"}`} />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className={`text-sm ${step.done ? "font-bold" : "text-muted-foreground"}`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums">{step.date}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
