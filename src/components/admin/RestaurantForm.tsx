"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink, AdminButton, AdminError } from "./ui";
import { Loader2, Save } from "lucide-react";
import type { Restaurant } from "@prisma/client";

const CATEGORIES = [
  { id: "غذاهای ایرانی", emoji: "🟢", gradient: "from-emerald-400 to-green-600" },
  { id: "کبابی", emoji: "🍢", gradient: "from-rose-400 to-red-600" },
  { id: "پیتزا", emoji: "🍕", gradient: "from-orange-400 to-amber-600" },
  { id: "فست فود", emoji: "🍔", gradient: "from-yellow-400 to-orange-600" },
  { id: "ساندویچ", emoji: "🥪", gradient: "from-amber-400 to-yellow-600" },
  { id: "شیرینی و نان", emoji: "🥐", gradient: "from-amber-300 to-orange-500" },
  { id: "دسر و بستنی", emoji: "🍰", gradient: "from-pink-400 to-rose-600" },
  { id: "نوشیدنی", emoji: "🥤", gradient: "from-sky-400 to-blue-600" },
];

export function RestaurantForm({
  mode,
  restaurant,
}: {
  mode: "create" | "edit";
  restaurant?: Restaurant;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(restaurant?.name || "");
  const [category, setCategory] = useState(restaurant?.category || "غذاهای ایرانی");
  const [description, setDescription] = useState(restaurant?.description || "");
  const [rating, setRating] = useState(restaurant ? String(restaurant.rating) : "4.5");
  const [reviewCount, setReviewCount] = useState(restaurant?.reviewCount || "0");
  const [deliveryTime, setDeliveryTime] = useState(restaurant?.deliveryTime || "۳۰-۴۵ دقیقه");
  const [deliveryFee, setDeliveryFee] = useState(restaurant?.deliveryFee || "رایگان");
  const [minOrder, setMinOrder] = useState(restaurant?.minOrder || "۱۰۰٬۰۰۰ ت");
  const [discount, setDiscount] = useState(restaurant?.discount ? String(restaurant.discount) : "");
  const [tagsText, setTagsText] = useState(
    restaurant?.tags ? (JSON.parse(restaurant.tags) as string[]).join("، ") : ""
  );
  const [isOpen, setIsOpen] = useState(restaurant?.isOpen ?? true);
  const [featured, setFeatured] = useState(restaurant?.featured ?? false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
      const tags = tagsText.split("،").map((t) => t.trim()).filter(Boolean);
      const body = {
        name,
        category,
        categoryEmoji: cat.emoji,
        coverGradient: cat.gradient,
        description,
        rating: Number(rating),
        reviewCount,
        deliveryTime,
        deliveryFee,
        minOrder,
        discount: discount ? Number(discount) : null,
        tags,
        isOpen,
        featured,
      };

      const url = mode === "create" ? "/api/admin/restaurants" : `/api/admin/restaurants/${restaurant!.id}`;
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
      router.push("/admin/restaurants");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackLink href="/admin/restaurants" label="بازگشت به رستوران‌ها" />
      <h1 className="text-xl font-bold mb-4">
        {mode === "create" ? "افزودن رستوران جدید" : "ویرایش رستوران"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="نام رستوران *">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" />
        </Field>

        <Field label="دسته‌بندی *">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input">
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.id}
              </option>
            ))}
          </select>
        </Field>

        <Field label="توضیحات *">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="form-input" />
        </Field>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="امتیاز">
            <input type="number" step="0.1" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} className="form-input" />
          </Field>
          <Field label="تعداد نظر">
            <input type="text" value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} className="form-input" />
          </Field>
          <Field label="درصد تخفیف">
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="form-input" />
          </Field>
          <Field label="حداقل سفارش">
            <input type="text" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className="form-input" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="زمان تحویل">
            <input type="text" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="form-input" />
          </Field>
          <Field label="هزینه ارسال">
            <input type="text" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} className="form-input" />
          </Field>
        </div>

        <Field label="برچسب‌ها (با «،» جدا کنید)">
          <input type="text" value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="form-input" placeholder="چلوکباب، خورشت، سنتی" />
        </Field>

        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} className="size-4" />
            باز است
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="size-4" />
            رستوران ویژه
          </label>
        </div>

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
                {mode === "create" ? "افزودن" : "ذخیره"}
              </>
            )}
          </AdminButton>
          <AdminButton href="/admin/restaurants" variant="outline">
            انصراف
          </AdminButton>
        </div>
      </form>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          background: var(--background, white);
          border: 1px solid var(--border, #e5e5e5);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        :global(.form-input:focus) {
          border-color: var(--primary, #0f766e);
          box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.2);
        }
      `}</style>
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
