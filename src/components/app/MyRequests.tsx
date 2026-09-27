"use client";

import { useEffect, useState } from "react";
import {
  sama137Requests as fallbackRequests,
  statusColors,
  statusEmojis,
  type Sama137Request,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Phone,
  Copy,
  CheckCircle2,
  X,
  Building2,
  User,
  Image as ImageIcon,
  Video,
} from "lucide-react";

type StatusFilter = "all" | "pending" | "in-progress" | "resolved";

const statusFilterTabs: { id: StatusFilter; label: string; emoji: string }[] = [
  { id: "all", label: "همه", emoji: "📋" },
  { id: "in-progress", label: "در حال پیگیری", emoji: "🔄" },
  { id: "pending", label: "در انتظار", emoji: "⏳" },
  { id: "resolved", label: "حل‌شده", emoji: "✅" },
];

export function MyRequests() {
  const [requests, setRequests] = useState<Sama137Request[]>(fallbackRequests);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // بارگذاری درخواست‌های سامانه ۱۳۷ از دیتابیس
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/public/sama137");
        const data = await res.json();
        if (active && Array.isArray(data.requests) && data.requests.length > 0) {
          setRequests(data.requests);
        }
      } catch {
        // fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = requests.filter((r) =>
    status === "all" ? true : r.status === status
  );

  const selected = requests.find((r) => r.id === selectedId);

  if (selected) {
    return (
      <RequestDetail
        request={selected}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="pt-3">
      {/* آمار سریع */}
      <div className="px-4 grid grid-cols-4 gap-2">
        <StatCard
          value={requests
            .filter((r) => r.status === "in-progress")
            .length.toLocaleString("fa-IR")}
          label="پیگیری"
          emoji="🔄"
          tone="bg-amber-50 border-amber-100"
        />
        <StatCard
          value={requests
            .filter((r) => r.status === "pending")
            .length.toLocaleString("fa-IR")}
          label="انتظار"
          emoji="⏳"
          tone="bg-slate-50 border-slate-200"
        />
        <StatCard
          value={requests
            .filter((r) => r.status === "resolved")
            .length.toLocaleString("fa-IR")}
          label="حل‌شده"
          emoji="✅"
          tone="bg-emerald-50 border-emerald-100"
        />
        <StatCard
          value={requests.length.toLocaleString("fa-IR")}
          label="کل"
          emoji="📋"
          tone="bg-card border-border/70"
        />
      </div>

      {/* تب فیلتر وضعیت */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-1.5 bg-card border border-border/70 rounded-xl p-1 shadow-sm overflow-x-auto no-scrollbar">
          {statusFilterTabs.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStatus(s.id)}
              className={cn(
                "flex-1 shrink-0 py-1.5 px-2 rounded-lg text-xs font-bold transition-all",
                status === s.id
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <span className="ml-1">{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* لیست درخواست‌ها */}
      <div className="px-4 pt-3 space-y-3 pb-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-5xl mb-2">📭</div>
            <p className="text-sm">درخواستی در این دسته وجود ندارد</p>
          </div>
        ) : (
          filtered.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              onClick={() => setSelectedId(r.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  emoji,
  tone,
}: {
  value: string;
  label: string;
  emoji: string;
  tone: string;
}) {
  return (
    <div className={cn("rounded-xl p-2 border shadow-sm text-center", tone)}>
      <div className="text-base">{emoji}</div>
      <div className="mt-0.5 text-base font-extrabold text-foreground tabular-nums">
        {value}
      </div>
      <div className="text-[9px] text-muted-foreground">{label}</div>
    </div>
  );
}

function RequestCard({
  request,
  onClick,
}: {
  request: Sama137Request;
  onClick: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(request.trackingCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-right rounded-2xl bg-card border border-border/70 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      <div className="p-3">
        {/* ردیف اول: آیکن + وضعیت */}
        <div className="flex items-start gap-3">
          <div className="size-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
            {request.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-md border",
                  statusColors[request.status]
                )}
              >
                {statusEmojis[request.status]} {request.statusLabel}
              </span>
              <span className="text-[10px] bg-primary/5 text-primary font-medium px-1.5 py-0.5 rounded-md">
                {request.categoryLabel}
              </span>
            </div>
            <h4 className="text-sm font-bold leading-snug line-clamp-2">
              {request.title}
            </h4>
          </div>
          <ChevronLeft className="size-4 text-muted-foreground shrink-0 mt-1" />
        </div>

        {/* آدرس */}
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{request.address}</span>
        </div>

        {/* ردیف پایین: کد رهگیری، تاریخ، پیوست‌ها */}
        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <span className="tabular-nums">{request.trackingCode}</span>
            {copied ? (
              <CheckCircle2 className="size-3 text-emerald-600" />
            ) : (
              <Copy className="size-3" />
            )}
          </button>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Paperclip className="size-3" />
              {request.attachments.length.toLocaleString("fa-IR")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {request.timeAgo}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function RequestDetail({
  request,
  onBack,
}: {
  request: Sama137Request;
  onBack: () => void;
}) {
  return (
    <div className="pb-4">
      {/* هدر جزئیات */}
      <div className="px-4 pt-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs text-primary font-bold mb-3 hover:underline"
        >
          <ChevronRight className="size-4" />
          بازگشت به لیست
        </button>

        <div className="rounded-2xl bg-card border border-border/70 shadow-sm p-3">
          <div className="flex items-start gap-3">
            <div className="size-14 rounded-xl bg-muted flex items-center justify-center text-3xl shrink-0">
              {request.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-md border",
                    statusColors[request.status]
                  )}
                >
                  {statusEmojis[request.status]} {request.statusLabel}
                </span>
                <span className="text-[10px] bg-primary/5 text-primary font-medium px-1.5 py-0.5 rounded-md">
                  {request.categoryLabel}
                </span>
              </div>
              <h3 className="text-sm font-bold leading-snug">{request.title}</h3>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin className="size-3" />
                <span className="truncate">{request.address}</span>
              </div>
            </div>
          </div>

          {/* کد رهگیری */}
          <div className="mt-3 flex items-center justify-between bg-primary/5 border border-primary/15 rounded-xl px-3 py-2">
            <div>
              <div className="text-[10px] text-muted-foreground">کد رهگیری</div>
              <div className="text-sm font-bold text-primary tabular-nums">
                {request.trackingCode}
              </div>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-muted-foreground">اولویت</div>
              <div className="text-xs font-bold text-foreground">
                {request.priorityLabel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* توضیحات */}
      <div className="px-4 pt-3">
        <div className="rounded-2xl bg-card border border-border/70 shadow-sm p-3">
          <h4 className="text-xs font-bold text-foreground mb-1.5">شرح مشکل</h4>
          <p className="text-[12px] text-foreground/80 leading-relaxed">
            {request.description}
          </p>
        </div>
      </div>

      {/* اطلاعات مسئول و واحد */}
      <div className="px-4 pt-3">
        <div className="rounded-2xl bg-card border border-border/70 shadow-sm p-3 space-y-2.5">
          <h4 className="text-xs font-bold text-foreground">اطلاعات مسئول پیگیری</h4>

          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="size-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-muted-foreground">واحد مربوطه</div>
              <div className="text-xs font-bold text-foreground truncate">
                {request.referenceUnit || "—"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <User className="size-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-muted-foreground">مسئول رسیدگی</div>
              <div className="text-xs font-bold text-foreground truncate">
                {request.assignedTo || "هنوز تعیین نشده"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
              <Calendar className="size-4 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-muted-foreground">تاریخ ثبت</div>
              <div className="text-xs font-bold text-foreground tabular-nums">
                {request.createdAt}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-[11px] font-bold py-2 rounded-lg active:scale-95 transition-transform"
          >
            <Phone className="size-3.5" />
            تماس با مسئول
          </button>
        </div>
      </div>

      {/* تایم‌لاین */}
      <div className="px-4 pt-3">
        <div className="rounded-2xl bg-card border border-border/70 shadow-sm p-3">
          <h4 className="text-xs font-bold text-foreground mb-3">مراحل پیگیری</h4>
          <ol className="space-y-0">
            {request.timeline.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "size-5 rounded-full flex items-center justify-center shrink-0",
                      step.done
                        ? "bg-emerald-500 text-white"
                        : "bg-muted border border-border"
                    )}
                  >
                    {step.done ? (
                      <CheckCircle2 className="size-3" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                    )}
                  </div>
                  {idx < request.timeline.length - 1 && (
                    <div
                      className={cn(
                        "w-0.5 flex-1 mt-1 mb-1",
                        step.done ? "bg-emerald-500/50" : "bg-border"
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div
                    className={cn(
                      "text-[12px] font-medium leading-tight",
                      step.done ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground tabular-nums mt-0.5">
                    {step.date}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* پیوست‌ها */}
      {request.attachments.length > 0 && (
        <div className="px-4 pt-3">
          <div className="rounded-2xl bg-card border border-border/70 shadow-sm p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-foreground">پیوست‌ها</h4>
              <span className="text-[10px] text-muted-foreground">
                {request.attachments.length.toLocaleString("fa-IR")} فایل
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {request.attachments.map((att) => (
                <div
                  key={att.id}
                  className="aspect-square rounded-xl bg-muted border border-border/70 flex flex-col items-center justify-center gap-1 hover:bg-muted/70 transition-colors"
                >
                  {att.type === "image" ? (
                    <ImageIcon className="size-5 text-sky-600" />
                  ) : (
                    <Video className="size-5 text-purple-600" />
                  )}
                  <div className="text-[9px] text-muted-foreground text-center px-1 truncate w-full">
                    {att.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
