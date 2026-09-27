"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink, AdminButton, AdminError } from "./ui";
import { Loader2, Save } from "lucide-react";
import type { Product } from "@prisma/client";

type Mode = "create" | "edit";

const CATEGORIES = [
  { id: "appliances", label: "لوازم خانگی" },
  { id: "kitchen", label: "آشپزخانه" },
  { id: "electronics", label: "الکترونیک" },
  { id: "home-decor", label: "دکوراسیون" },
  { id: "cleaning", label: "نظافت" },
];

export function ProductForm({ mode, product }: { mode: Mode; product?: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State فیلدها
  const [name, setName] = useState(product?.name || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [originalPrice, setOriginalPrice] = useState(
    product?.originalPrice ? String(product.originalPrice) : ""
  );
  const [discount, setDiscount] = useState(
    product?.discount ? String(product.discount) : ""
  );
  const [emoji, setEmoji] = useState(product?.emoji || "📦");
  const [rating, setRating] = useState(product ? String(product.rating) : "4.5");
  const [reviewCount, setReviewCount] = useState(
    product ? String(product.reviewCount) : "0"
  );
  const [soldCount, setSoldCount] = useState(
    product ? String(product.soldCount) : "0"
  );
  const [installment, setInstallment] = useState(product?.installment || "");
  const [category, setCategory] = useState(product?.category || "appliances");
  const [categoryLabel, setCategoryLabel] = useState(
    product?.categoryLabel || "لوازم خانگی"
  );
  const [description, setDescription] = useState(product?.description || "");
  const [featuresText, setFeaturesText] = useState(
    product?.features
      ? (JSON.parse(product.features) as string[]).join("\n")
      : ""
  );
  const [specsText, setSpecsText] = useState(
    product?.specs ? formatSpecsForEdit(JSON.parse(product.specs)) : ""
  );
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [freeShipping, setFreeShipping] = useState(product?.freeShipping ?? false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const features = featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const specs = parseSpecs(specsText);

      const body = {
        name,
        brand,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        discount: discount ? Number(discount) : undefined,
        emoji,
        rating: Number(rating),
        reviewCount: Number(reviewCount),
        soldCount: Number(soldCount),
        installment,
        category,
        categoryLabel,
        description,
        features,
        specs,
        inStock,
        freeShipping,
      };

      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${product!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا در ذخیره‌سازی");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackLink href="/admin/products" label="بازگشت به محصولات" />

      <h1 className="text-xl font-bold mb-4">
        {mode === "create" ? "افزودن محصول جدید" : "ویرایش محصول"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* نام و برند */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="نام محصول *">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </Field>
          <Field label="برند *">
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="form-input"
            />
          </Field>
        </div>

        {/* قیمت و تخفیف */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="قیمت (تومان) *">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="form-input"
            />
          </Field>
          <Field label="قیمت اصلی (تومان)">
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="درصد تخفیف">
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="form-input"
              placeholder="مثلاً ۱۲"
            />
          </Field>
          <Field label="اموجی">
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="form-input"
              maxLength={4}
            />
          </Field>
        </div>

        {/* دسته‌بندی */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="دسته‌بندی (کلید) *">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                const cat = CATEGORIES.find((c) => c.id === e.target.value);
                if (cat) setCategoryLabel(cat.label);
              }}
              className="form-input"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="نام دسته (نمایش)">
            <input
              type="text"
              value={categoryLabel}
              onChange={(e) => setCategoryLabel(e.target.value)}
              className="form-input"
            />
          </Field>
        </div>

        {/* آمار */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="امتیاز (۰-۵)">
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="تعداد نظر">
            <input
              type="number"
              value={reviewCount}
              onChange={(e) => setReviewCount(e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="تعداد فروش">
            <input
              type="number"
              value={soldCount}
              onChange={(e) => setSoldCount(e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="خرید قسطی (متن)">
            <input
              type="text"
              value={installment}
              onChange={(e) => setInstallment(e.target.value)}
              className="form-input"
              placeholder="مثلاً ۱۲ ماه قسطی"
            />
          </Field>
        </div>

        {/* توضیحات */}
        <Field label="توضیحات">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="form-input"
          />
        </Field>

        {/* ویژگی‌ها — هر خط یک ویژگی */}
        <Field label="ویژگی‌ها (هر خط یک ویژگی)">
          <textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={4}
            placeholder={"موتور اینورتر\n۱۲ برنامه شستشو\nکلاس انرژی A+++"}
            className="form-input"
          />
        </Field>

        {/* مشخصات فنی */}
        <Field label="مشخصات فنی (هر خط: عنوان|مقدار)">
          <textarea
            value={specsText}
            onChange={(e) => setSpecsText(e.target.value)}
            rows={4}
            placeholder={"ظرفیت|۸ کیلوگرم\nتوان|۹۰۰ وات"}
            className="form-input"
          />
        </Field>

        {/* چکباکس‌ها */}
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="size-4"
            />
            موجود در انبار
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={freeShipping}
              onChange={(e) => setFreeShipping(e.target.checked)}
              className="size-4"
            />
            ارسال رایگان
          </label>
        </div>

        {error && <AdminError message={error} />}

        {/* دکمه‌ها */}
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
                {mode === "create" ? "افزودن محصول" : "ذخیره تغییرات"}
              </>
            )}
          </AdminButton>
          <AdminButton href="/admin/products" variant="outline">
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

function formatSpecsForEdit(specs: { label: string; value: string }[]): string {
  return specs.map((s) => `${s.label}|${s.value}`).join("\n");
}

function parseSpecs(text: string): { label: string; value: string }[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, value] = line.split("|").map((s) => s.trim());
      return { label: label || "", value: value || "" };
    })
    .filter((s) => s.label);
}
