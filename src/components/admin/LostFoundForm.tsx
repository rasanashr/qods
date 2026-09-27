"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink, AdminButton, AdminError } from "./ui";
import { Loader2, Save } from "lucide-react";
import type { LostFoundItem } from "@prisma/client";

const CATEGORIES = [
  { value: "documents", label: "مدارک", emoji: "📄" },
  { value: "electronics", label: "الکترونیک", emoji: "📱" },
  { value: "keys", label: "کلید و قفل", emoji: "🔑" },
  { value: "bags", label: "کیف و کوله", emoji: "💼" },
  { value: "pets", label: "حیوانات", emoji: "🐾" },
  { value: "jewelry", label: "جواهرات", emoji: "💎" },
  { value: "vehicles", label: "وسایل نقلیه", emoji: "🚲" },
  { value: "other", label: "سایر", emoji: "❓" },
];

const EMOJIS = ["📄", "📱", "🔑", "💼", "🐾", "💎", "🚲", "📦", "🎒", "💳", "🎫"];

export function LostFoundForm({ mode, item }: { mode: "create" | "edit"; item?: LostFoundItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(item?.title || "");
  const [status, setStatus] = useState<"lost" | "found">(item?.status as "lost" | "found" || "lost");
  const [category, setCategory] = useState(item?.category || "documents");
  const [categoryLabel, setCategoryLabel] = useState(item?.categoryLabel || "مدارک");
  const [emoji, setEmoji] = useState(item?.emoji || "📦");
  const [description, setDescription] = useState(item?.description || "");
  const [location, setLocation] = useState(item?.location || "");
  const [district, setDistrict] = useState(item?.district || "");
  const [date, setDate] = useState(item?.date || "");
  const [timeAgo, setTimeAgo] = useState(item?.timeAgo || "همین الان");
  const [reward, setReward] = useState(item?.reward || "");
  const [contactName, setContactName] = useState(item?.contactName || "");
  const [contactType, setContactType] = useState<"owner" | "finder">(item?.contactType as "owner" | "finder" || "owner");
  const [tagsText, setTagsText] = useState(
    item?.tags ? (JSON.parse(item.tags) as string[]).join("، ") : ""
  );
  const [statusAdmin, setStatusAdmin] = useState(item?.status_admin || "approved");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const tags = tagsText.split("،").map((t) => t.trim()).filter(Boolean);
      const body = {
        title,
        status,
        category,
        categoryLabel,
        emoji,
        description,
        location,
        district,
        date,
        timeAgo,
        reward: reward || null,
        contactName,
        contactType,
        tags,
        status_admin: statusAdmin,
      };

      const url = mode === "create" ? "/api/admin/lost-found" : `/api/admin/lost-found/${item!.id}`;
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
      router.push("/admin/lost-found");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackLink href="/admin/lost-found" label="بازگشت به اشیاء گمشده" />
      <h1 className="text-xl font-bold mb-4">
        {mode === "create" ? "افزودن مورد جدید" : "ویرایش مورد"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="عنوان *">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-input" placeholder="گواهینامه به نام محمد رضایی" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="وضعیت *">
            <select value={status} onChange={(e) => setStatus(e.target.value as "lost" | "found")} className="form-input">
              <option value="lost">❌ گم‌شده</option>
              <option value="found">✅ پیدا‌شده</option>
            </select>
          </Field>
          <Field label="نوع تماس">
            <select value={contactType} onChange={(e) => setContactType(e.target.value as "owner" | "finder")} className="form-input">
              <option value="owner">مالک</option>
              <option value="finder">یابنده</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="دسته‌بندی *">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                const c = CATEGORIES.find((x) => x.value === e.target.value);
                if (c) setCategoryLabel(c.label);
              }}
              className="form-input"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="نام تماس">
            <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="form-input" placeholder="نام شخص" />
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

        <Field label="توضیحات *">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="form-input" placeholder="شرح کامل و مشخصات" />
        </Field>

        <Field label="محل / مکان">
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="form-input" placeholder="میدان قدس، خیابان امام" />
        </Field>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Field label="منطقه">
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="form-input" />
          </Field>
          <Field label="تاریخ (شمسی)">
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" placeholder="1404/06/25" />
          </Field>
          <Field label="مدت قبل">
            <input type="text" value={timeAgo} onChange={(e) => setTimeAgo(e.target.value)} className="form-input" placeholder="امروز" />
          </Field>
        </div>

        <Field label="پاداش (اختیاری)">
          <input type="text" value={reward} onChange={(e) => setReward(e.target.value)} className="form-input" placeholder="۵۰۰٬۰۰۰ تومان پاداش" />
        </Field>

        <Field label="برچسب‌ها (با «،» جدا کنید)">
          <input type="text" value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="form-input" placeholder="گواهینامه، مدارک هویتی" />
        </Field>

        <Field label="وضعیت تأیید">
          <select value={statusAdmin} onChange={(e) => setStatusAdmin(e.target.value)} className="form-input">
            <option value="pending">در انتظار بررسی</option>
            <option value="approved">تأیید شده</option>
            <option value="rejected">رد شده</option>
          </select>
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
                {mode === "create" ? "افزودن مورد" : "ذخیره تغییرات"}
              </>
            )}
          </AdminButton>
          <AdminButton href="/admin/lost-found" variant="outline">
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
