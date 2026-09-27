"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink, AdminButton, AdminError } from "./ui";
import { Loader2, Save } from "lucide-react";
import type { ClassifiedPricing } from "@prisma/client";

export function CategoryForm({
  mode,
  category,
}: {
  mode: "create" | "edit";
  category?: ClassifiedPricing;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categoryKey, setCategoryKey] = useState(category?.category || "");
  const [categoryLabel, setCategoryLabel] = useState(category?.categoryLabel || "");
  const [freeDays, setFreeDays] = useState(category ? String(category.freeDays) : "7");
  const [featuredPrice, setFeaturedPrice] = useState(category ? String(category.featuredPrice) : "50000");
  const [urgentPrice, setUrgentPrice] = useState(category ? String(category.urgentPrice) : "25000");
  const [featuredDays, setFeaturedDays] = useState(category ? String(category.featuredDays) : "30");
  const [urgentDays, setUrgentDays] = useState(category ? String(category.urgentDays) : "14");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const body = {
        category: categoryKey,
        categoryLabel,
        freeDays: Number(freeDays),
        featuredPrice: Number(featuredPrice),
        urgentPrice: Number(urgentPrice),
        featuredDays: Number(featuredDays),
        urgentDays: Number(urgentDays),
        isActive,
      };

      const url =
        mode === "create"
          ? "/api/admin/classifieds/categories"
          : `/api/admin/classifieds/categories/${category!.id}`;
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
      router.push("/admin/classifieds/categories");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackLink href="/admin/classifieds/categories" label="بازگشت به دسته‌بندی‌ها" />
      <h1 className="text-xl font-bold mb-4">
        {mode === "create" ? "افزودن دسته‌بندی جدید" : "ویرایش دسته‌بندی"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "create" && (
          <Field label="کلید دسته (انگلیسی، بدون فاصله) *" hint="مثلاً: electronics, vehicles, jobs">
            <input
              type="text"
              value={categoryKey}
              onChange={(e) => setCategoryKey(e.target.value.replace(/[^a-z0-9-]/g, "").toLowerCase())}
              required
              dir="ltr"
              className="form-input text-left"
              placeholder="electronics"
            />
          </Field>
        )}

        <Field label="نام نمایشی (فارسی) *">
          <input
            type="text"
            value={categoryLabel}
            onChange={(e) => setCategoryLabel(e.target.value)}
            required
            className="form-input"
            placeholder="الکترونیک"
          />
        </Field>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Field label="روزهای رایگان">
            <input type="number" value={freeDays} onChange={(e) => setFreeDays(e.target.value)} className="form-input" />
          </Field>
          <Field label="قیمت ویژه (تومان)">
            <input type="number" value={featuredPrice} onChange={(e) => setFeaturedPrice(e.target.value)} className="form-input" />
          </Field>
          <Field label="روزهای ویژه">
            <input type="number" value={featuredDays} onChange={(e) => setFeaturedDays(e.target.value)} className="form-input" />
          </Field>
          <Field label="قیمت فوری (تومان)">
            <input type="number" value={urgentPrice} onChange={(e) => setUrgentPrice(e.target.value)} className="form-input" />
          </Field>
          <Field label="روزهای فوری">
            <input type="number" value={urgentDays} onChange={(e) => setUrgentDays(e.target.value)} className="form-input" />
          </Field>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="size-4" />
          فعال
        </label>

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
                {mode === "create" ? "افزودن دسته" : "ذخیره تغییرات"}
              </>
            )}
          </AdminButton>
          <AdminButton href="/admin/classifieds/categories" variant="outline">
            انصراف
          </AdminButton>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold mb-1.5 block">{label}</label>
      {children}
      {hint && <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}
