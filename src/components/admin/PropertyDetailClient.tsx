"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink, AdminBadge, AdminButton, AdminError } from "./ui";
import { Loader2, Save, CheckCircle2, XCircle } from "lucide-react";
import type { Property } from "@prisma/client";

export function PropertyDetailClient({ property }: { property: Property }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(property.status);

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus);
    setError("");
    try {
      const res = await fetch(`/api/admin/properties/${property.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا");
      }
      setStatus(newStatus);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(null);
    }
  };

  const features: string[] = property.features
    ? (JSON.parse(property.features) as string[])
    : [];

  return (
    <div>
      <BackLink href="/admin/properties" label="بازگشت به آگهی‌ها" />

      <div className="bg-card border border-border/70 rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
            {property.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold">{property.title}</h1>
            <div className="text-xs text-muted-foreground mt-0.5">
              {property.dealLabel} · {property.typeLabel}
            </div>
          </div>
          <AdminBadge
            color={
              status === "approved"
                ? "bg-emerald-50 text-emerald-700"
                : status === "pending"
                ? "bg-amber-50 text-amber-700"
                : "bg-rose-50 text-rose-700"
            }
          >
            {status === "approved" ? "تأیید شده" : status === "pending" ? "در انتظار" : "رد شده"}
          </AdminBadge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          <Detail label="متراژ" value={`${property.area.toLocaleString("fa-IR")} م²`} />
          <Detail label="خواب" value={property.rooms ? property.rooms.toLocaleString("fa-IR") : "—"} />
          <Detail label="طبقه" value={property.floor ? property.floor.toLocaleString("fa-IR") : "—"} />
          <Detail label="سن" value={property.age ? `${property.age.toLocaleString("fa-IR")} سال` : "نوساز"} />
          <Detail label="قیمت" value={property.price} />
          {property.rent && <Detail label="اجاره" value={property.rent} />}
          <Detail label="منطقه" value={property.district} />
          <Detail label="زمان" value={property.timeAgo} />
        </div>

        <div className="mt-3 pt-3 border-t border-border/60">
          <Detail label="آدرس کامل" value={property.location} />
        </div>

        {features.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/60">
            <div className="text-[10px] text-muted-foreground mb-1">امکانات</div>
            <div className="flex flex-wrap gap-1">
              {features.map((f, i) => (
                <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* اقدامات ادمین */}
      <div className="bg-card border border-border/70 rounded-xl shadow-sm p-4">
        <h2 className="text-sm font-bold mb-3">اقدامات ادمین</h2>
        <div className="flex gap-2 flex-wrap">
          <AdminButton
            href={`/admin/properties/${property.id}/edit`}
            variant="outline"
          >
            ویرایش کامل
          </AdminButton>
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
          <AdminButton
            variant="danger"
            onClick={() => updateStatus("rejected")}
            disabled={loading !== null}
          >
            {loading === "rejected" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <XCircle className="size-4" />
            )}
            رد آگهی
          </AdminButton>
          <AdminButton
            variant="outline"
            onClick={() => updateStatus("pending")}
            disabled={loading !== null}
          >
            بازگرداندن به در انتظار
          </AdminButton>
        </div>
        {error && <div className="mt-2"><AdminError message={error} /></div>}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}
