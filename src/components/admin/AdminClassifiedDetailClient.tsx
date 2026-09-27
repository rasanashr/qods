"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink, AdminButton, AdminError, AdminBadge } from "./ui";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  User,
  Wallet,
  Clock,
} from "lucide-react";

type Item = {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  emoji: string;
  description: string;
  price: string;
  location: string;
  district: string | null;
  timeAgo: string;
  badgeColor: string;
  tags: string | null;
  contactName: string | null;
  contactPhone: string | null;
  isPaid: boolean;
  paidAmount: number;
  plan: string;
  status: string;
  rejectionReason: string | null;
  publishedAt: Date | string | null;
  expiresAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  owner: {
    id: string;
    name: string | null;
    phone: string;
    joinedAt: Date | string;
  } | null;
};

export function AdminClassifiedDetailClient({ item: initialItem }: { item: Item }) {
  const router = useRouter();
  const [item, setItem] = useState<Item>(initialItem);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [rejectionReason, setRejectionReason] = useState(initialItem.rejectionReason || "");

  const updateStatus = async (status: string, reason?: string) => {
    setLoading(status);
    setError("");
    try {
      const res = await fetch(`/api/admin/classifieds/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason: reason }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا");
      }
      const data = await res.json();
      setItem(data.item);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(null);
    }
  };

  const tags: string[] = item.tags ? JSON.parse(item.tags) : [];
  const createdDate = new Date(item.createdAt);
  const publishedDate = item.publishedAt ? new Date(item.publishedAt as string) : null;
  const expiresDate = item.expiresAt ? new Date(item.expiresAt as string) : null;
  const joinedDate = item.owner?.joinedAt ? new Date(item.owner.joinedAt as string) : null;

  return (
    <div>
      <BackLink href="/admin/classifieds" label="بازگشت به آگهی‌ها" />

      {/* کارت اصلی */}
      <div className="bg-card border border-border/70 rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="size-14 rounded-xl bg-muted flex items-center justify-center text-3xl shrink-0">
            {item.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold">{item.title}</h1>
            <div className="text-xs text-muted-foreground mt-1">
              {item.categoryLabel} · {item.location}
            </div>
          </div>
          <AdminBadge
            color={
              item.status === "approved"
                ? "bg-emerald-50 text-emerald-700"
                : item.status === "pending"
                ? "bg-amber-50 text-amber-700"
                : "bg-rose-50 text-rose-700"
            }
          >
            {item.status === "approved" ? "تأیید شده" : item.status === "pending" ? "در انتظار" : "رد شده"}
          </AdminBadge>
        </div>

        {/* اطلاعات آگهی */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-border/60">
          <Detail label="قیمت" value={item.price} />
          <Detail label="منطقه" value={item.district || "—"} />
          <Detail label="نوع طرح" value={item.plan === "free" ? "رایگان" : item.plan === "featured" ? "ویژه" : "فوری"} />
          <Detail label="پرداختی" value={item.isPaid ? `${item.paidAmount.toLocaleString("fa-IR")} ت` : "رایگان"} />
          <Detail label="تاریخ ثبت" value={createdDate.toLocaleDateString("fa-IR")} />
          <Detail label="انقضا" value={expiresDate ? expiresDate.toLocaleDateString("fa-IR") : "—"} />
          <Detail label="انتشار" value={publishedDate ? publishedDate.toLocaleDateString("fa-IR") : "—"} />
          <Detail label="زمان نمایش" value={item.timeAgo} />
        </div>

        {/* توضیحات */}
        <div className="mt-3 pt-3 border-t border-border/60">
          <div className="text-[10px] text-muted-foreground mb-1">شرح آگهی</div>
          <p className="text-sm leading-relaxed">{item.description}</p>
        </div>

        {/* برچسب‌ها */}
        {tags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/60">
            <div className="text-[10px] text-muted-foreground mb-1">برچسب‌ها</div>
            <div className="flex flex-wrap gap-1">
              {tags.map((t, i) => (
                <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* اطلاعات تماس */}
        <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-2 gap-3">
          <Detail label="نام تماس" value={item.contactName || "—"} />
          <Detail label="شماره تماس" value={item.contactPhone || "—"} />
        </div>
      </div>

      {/* اطلاعات مالک */}
      {item.owner && (
        <div className="bg-card border border-border/70 rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-sm font-bold mb-3 flex items-center gap-1.5">
            <User className="size-4 text-primary" />
            اطلاعات کاربر (مالک آگهی)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Detail label="نام" value={item.owner.name || "بدون نام"} />
            <Detail label="شماره موبایل" value={item.owner.phone} dir="ltr" />
            <Detail
              label="عضویت از"
              value={joinedDate ? joinedDate.toLocaleDateString("fa-IR") : "—"}
            />
          </div>
        </div>
      )}

      {/* فرم رد با دلیل */}
      {item.status === "rejected" && item.rejectionReason && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4">
          <div className="text-xs font-bold text-rose-900 mb-1">دلیل رد</div>
          <p className="text-sm text-rose-800">{item.rejectionReason}</p>
        </div>
      )}

      {/* اقدامات ادمین */}
      <div className="bg-card border border-border/70 rounded-xl shadow-sm p-4">
        <h2 className="text-sm font-bold mb-3">اقدامات ادمین</h2>

        {/* فیلد دلیل رد */}
        {item.status !== "rejected" && (
          <div className="mb-3">
            <label className="text-xs font-bold mb-1.5 block">دلیل رد (اختیاری)</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={2}
              placeholder="مثلاً: آگهی تکراری است / اطلاعات ناقص / ..."
              className="form-input resize-none"
            />
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {item.status !== "approved" && (
            <AdminButton
              variant="success"
              onClick={() => updateStatus("approved")}
              disabled={loading !== null}
            >
              {loading === "approved" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              تأیید آگهی
            </AdminButton>
          )}
          {item.status !== "rejected" && (
            <AdminButton
              variant="danger"
              onClick={() => updateStatus("rejected", rejectionReason || undefined)}
              disabled={loading !== null}
            >
              {loading === "rejected" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <XCircle className="size-4" />
              )}
              رد آگهی
            </AdminButton>
          )}
          {item.status !== "pending" && (
            <AdminButton
              variant="outline"
              onClick={() => updateStatus("pending")}
              disabled={loading !== null}
            >
              <RefreshCw className="size-4" />
              بازگرداندن به انتظار
            </AdminButton>
          )}
        </div>

        {error && <div className="mt-2"><AdminError message={error} /></div>}
      </div>
    </div>
  );
}

function Detail({ label, value, dir }: { label: string; value: string; dir?: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-sm font-bold" dir={dir}>{value}</div>
    </div>
  );
}
