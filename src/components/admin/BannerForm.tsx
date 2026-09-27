"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink, AdminButton, AdminError } from "./ui";
import { Loader2, Save } from "lucide-react";
import type { Banner } from "@prisma/client";

const GRADIENTS = [
  "from-teal-600 via-emerald-600 to-green-700",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-purple-600 via-fuchsia-600 to-pink-600",
  "from-sky-600 via-cyan-600 to-blue-700",
  "from-orange-500 via-rose-500 to-pink-600",
  "from-emerald-500 via-teal-500 to-green-600",
  "from-rose-500 via-red-500 to-rose-700",
  "from-amber-400 via-yellow-500 to-orange-600",
  "from-pink-400 via-rose-400 to-pink-600",
];

const EMOJIS = ["🏛️", "🏆", "🛍️", "📞", "🎉", "💬", "💳", "🍽️", "🏠", "🚀", "✨", "📰"];

const POSITIONS = [
  { value: "home_carousel", label: "اسلایدر صفحه اصلی" },
  { value: "ad_banner", label: "بنر تبلیغاتی" },
];

export function BannerForm({ mode, banner }: { mode: "create" | "edit"; banner?: Banner }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(banner?.title || "");
  const [subtitle, setSubtitle] = useState(banner?.subtitle || "");
  const [cta, setCta] = useState(banner?.cta || "");
  const [gradient, setGradient] = useState(banner?.gradient || GRADIENTS[0]);
  const [emoji, setEmoji] = useState(banner?.emoji || "✨");
  const [position, setPosition] = useState(banner?.position || "home_carousel");
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(banner ? String(banner.sortOrder) : "0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const body = {
        title,
        subtitle,
        cta,
        gradient,
        emoji,
        position,
        isActive,
        sortOrder: Number(sortOrder) || 0,
      };

      const url = mode === "create" ? "/api/admin/banners" : `/api/admin/banners/${banner!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا");
      }
      router.push("/admin/banners");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackLink href="/admin/banners" label="بازگشت به بنرها" />
      <h1 className="text-xl font-bold mb-4">
        {mode === "create" ? "افزودن بنر جدید" : "ویرایش بنر"}
      </h1>

      {/* پیش‌نمایش زنده */}
      <div className="mb-4">
        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br text-white p-4 shadow-md ${gradient}`}
        >
          <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-white/10 blur-lg" />
          <div className="relative flex items-center gap-3">
            <div className="text-4xl shrink-0 drop-shadow">{emoji}</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold leading-snug">{title || "عنوان بنر"}</h3>
              <p className="text-[11px] text-white/85 mt-0.5 line-clamp-1">
                {subtitle || "زیرعنوان بنر در اینجا نمایش داده می‌شود"}
              </p>
              {cta && (
                <span className="mt-2 inline-flex items-center gap-1 bg-white text-primary text-[11px] font-bold px-3 py-1 rounded-lg shadow">
                  {cta}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="عنوان *">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-input" placeholder="مثلاً: مسابقه بزرگ شبکه قدس" />
        </Field>

        <Field label="زیرعنوان">
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="form-input" placeholder="مثلاً: تا سقف ۵۰ میلیون ریال جایزه" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="متن دکمه">
            <input type="text" value={cta} onChange={(e) => setCta(e.target.value)} className="form-input" placeholder="مثلاً: شرکت در مسابقه" />
          </Field>
          <Field label="موقعیت">
            <select value={position} onChange={(e) => setPosition(e.target.value)} className="form-input">
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="ترتیب نمایش">
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="form-input" placeholder="0" />
          </Field>
          <Field label="وضعیت">
            <label className="inline-flex items-center gap-2 text-sm h-full mt-6">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="size-4" />
              فعال
            </label>
          </Field>
        </div>

        <Field label="اموجی">
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setEmoji(em)}
                className={`size-10 rounded-lg flex items-center justify-center text-xl ${
                  emoji === em ? "bg-primary/10 ring-2 ring-primary" : "bg-muted"
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        </Field>

        <Field label="گرادینت رنگ">
          <div className="grid grid-cols-3 gap-2">
            {GRADIENTS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGradient(g)}
                className={`h-12 rounded-lg bg-gradient-to-br ${g} ${
                  gradient === g ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
                aria-label={g}
              />
            ))}
          </div>
        </Field>

        {error && <AdminError message={error} />}

        <div className="flex gap-2">
          <AdminButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                در حال ذخیره…
              </>
            ) : (
              <>
                <Save className="size-4" />
                {mode === "create" ? "افزودن بنر" : "ذخیره تغییرات"}
              </>
            )}
          </AdminButton>
          <AdminButton href="/admin/banners" variant="outline">
            انصراف
          </AdminButton>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
