"use client";

import { useEffect, useMemo, useState } from "react";
import { products, type ProductItem } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useNav } from "@/lib/nav-store";
import {
  ChevronRight,
  Star,
  Wallet,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Plus,
  Minus,
  CheckCircle2,
  Loader2,
  Heart,
  Share2,
  ChevronLeft,
} from "lucide-react";

type Tab = "description" | "specs" | "reviews";

const trustBadges = [
  { icon: ShieldCheck, label: "ضمانت اصالت", color: "text-emerald-600" },
  { icon: RefreshCcw, label: "۷ روز بازگشت", color: "text-sky-600" },
  { icon: Truck, label: "ارسال سریع", color: "text-amber-600" },
];

export function ProductDetailPage() {
  const { selectedProductId, setView, openProduct } = useNav();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);

  // بارگذاری محصول از دیتابیس با استفاده از id
  useEffect(() => {
    let active = true;
    if (!selectedProductId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/public/products-by-id?id=${encodeURIComponent(selectedProductId)}`);
        const data = await res.json();
        if (active && data.product) {
          setProduct(data.product);
        }
      } catch {
        // fallback به data.ts
        if (active) {
          const fallback = products.find((p) => p.id === selectedProductId);
          if (fallback) setProduct(fallback);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedProductId]);

  const [tab, setTab] = useState<Tab>("description");
  const [quantity, setQuantity] = useState(1);
  const [installment, setInstallment] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // ریست stateها هنگام تغییر محصول
  useEffect(() => {
    setTab("description");
    setQuantity(1);
    setInstallment(false);
    setAdded(false);
    setBookmarked(false);
  }, [selectedProductId]);

  if (!product) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <div className="text-5xl mb-2">📦</div>
          <p className="text-sm text-muted-foreground">محصول یافت نشد</p>
          <button
            type="button"
            onClick={() => setView("store")}
            className="mt-3 text-xs text-primary font-bold hover:underline"
          >
            بازگشت به فروشگاه
          </button>
        </div>
      </div>
    );
  }

  // محصولات مرتبط (همان دسته)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (adding || added) return;
    setAdding(true);
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }, 1200);
  };

  return (
    <>
      {/* هدر */}
      <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
        <div className="px-4 pt-3 pb-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("store")}
            aria-label="بازگشت به فروشگاه"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold truncate">{product.name}</h1>
            <p className="text-[11px] text-white/80">
              {product.brand} · {product.categoryLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBookmarked((v) => !v)}
            aria-label="افزودن به علاقه‌مندی‌ها"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <Heart
              className={cn(
                "size-4.5 transition-colors",
                bookmarked ? "fill-rose-400 text-rose-400" : "text-white"
              )}
            />
          </button>
          <button
            type="button"
            aria-label="اشتراک‌گذاری"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <Share2 className="size-4.5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-24">
        {/* گالری تصاویر */}
        <section className="bg-card">
          <div
            className={cn(
              "relative h-64 flex items-center justify-center text-8xl",
              product.bg
            )}
          >
            {product.emoji}
            {product.discount && (
              <span className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
                ٪{product.discount.toLocaleString("fa-IR")} تخفیف
              </span>
            )}
            {product.freeShipping && (
              <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                <Truck className="size-3" />
                ارسال رایگان
              </span>
            )}
          </div>

          {/* تصاویر کوچک (همه از یک اموجی استفاده می‌کنند برای نمونه) */}
          <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                className={cn(
                  "size-16 rounded-xl flex items-center justify-center text-2xl shrink-0 ring-1",
                  i === 0
                    ? "bg-muted ring-primary"
                    : "bg-card ring-border hover:bg-muted/50 transition-colors"
                )}
              >
                {product.emoji}
              </button>
            ))}
          </div>
        </section>

        {/* اطلاعات اصلی محصول */}
        <section className="px-4 pt-4">
          <div className="rounded-2xl bg-card border border-border/70 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold bg-primary/5 text-primary px-2 py-0.5 rounded-md">
                {product.categoryLabel}
              </span>
              <span className="text-[10px] text-muted-foreground">
                برند {product.brand}
              </span>
            </div>
            <h2 className="text-base font-bold leading-snug">{product.name}</h2>

            {/* امتیاز */}
            <div className="mt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded-md tabular-nums">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {product.rating.toLocaleString("fa-IR")}
              </div>
              <span className="text-[11px] text-muted-foreground">
                ({product.reviewCount?.toLocaleString("fa-IR") || "—"} نظر)
              </span>
              <span className="text-[11px] text-muted-foreground">·</span>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
                <CheckCircle2 className="size-3" />
                {product.soldCount} فروش
              </span>
            </div>

            {/* قیمت */}
            <div className="mt-3 pt-3 border-t border-border/60">
              <div className="flex items-end justify-between gap-2">
                <div>
                  {product.originalPrice && (
                    <div className="text-xs text-muted-foreground line-through tabular-nums">
                      {product.originalPrice}
                    </div>
                  )}
                  <div className="text-2xl font-extrabold text-primary tabular-nums">
                    {product.price}
                  </div>
                </div>
                {product.discount && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                    {product.discount.toLocaleString("fa-IR")}٪ تخفیف
                  </span>
                )}
              </div>
              {installment && (
                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                  <Wallet className="size-3.5" />
                  <span className="font-medium">
                    قسط ماهانه: تقریبی{" "}
                    {estimateInstallment(product.price, product.installment)}
                  </span>
                </div>
              )}
            </div>

            {/* نشان‌های اعتماد */}
            <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-3 gap-2">
              {trustBadges.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-1 text-center"
                  >
                    <Icon className={cn("size-5", b.color)} />
                    <span className="text-[9px] text-muted-foreground leading-tight">
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* انتخاب تعداد و نوع خرید */}
        <section className="px-4 pt-3">
          <div className="rounded-2xl bg-card border border-border/70 shadow-sm p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">تعداد</span>
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="کاهش"
                  className="size-7 rounded-md bg-card shadow-sm flex items-center justify-center hover:bg-muted/50 transition-colors"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="text-sm font-bold tabular-nums min-w-6 text-center">
                  {quantity.toLocaleString("fa-IR")}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="افزایش"
                  className="size-7 rounded-md bg-card shadow-sm flex items-center justify-center hover:bg-muted/50 transition-colors"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            {/* انتخاب نقدی/قسطی */}
            <div>
              <span className="text-xs font-bold text-foreground block mb-2">
                نوع خرید
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInstallment(false)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all",
                    !installment
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <span className="text-xl">💵</span>
                  <span className="text-[11px] font-bold">خرید نقدی</span>
                  <span className="text-[10px] text-muted-foreground">پرداخت یکجا</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInstallment(true)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all",
                    installment
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <span className="text-xl">💳</span>
                  <span className="text-[11px] font-bold">خرید قسطی</span>
                  <span className="text-[10px] text-muted-foreground">
                    {product.installment}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* تب‌های توضیحات/مشخصات/نظرات */}
        <section className="px-4 pt-3">
          <div className="rounded-2xl bg-card border border-border/70 shadow-sm overflow-hidden">
            <div role="tablist" className="flex border-b border-border/60">
              {[
                { id: "description" as const, label: "توضیحات" },
                { id: "specs" as const, label: "مشخصات" },
                { id: "reviews" as const, label: "نظرات" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex-1 py-2.5 text-xs font-bold transition-all",
                    tab === t.id
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-3">
              {tab === "description" && (
                <div>
                  <p className="text-[12px] text-foreground/80 leading-relaxed">
                    {product.description}
                  </p>
                  {product.features && product.features.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-foreground mb-2">
                        ویژگی‌های شاخص
                      </h4>
                      <ul className="space-y-1.5">
                        {product.features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[11px] text-foreground/80"
                          >
                            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {tab === "specs" && (
                <div className="space-y-0">
                  {product.specs?.map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
                    >
                      <span className="text-[11px] text-muted-foreground">
                        {spec.label}
                      </span>
                      <span className="text-[11px] font-bold text-foreground">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "reviews" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 pb-3 border-b border-border/60">
                    <div className="text-center">
                      <div className="text-3xl font-extrabold text-amber-500 tabular-nums">
                        {product.rating.toLocaleString("fa-IR")}
                      </div>
                      <div className="flex items-center justify-center mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "size-3",
                              s <= Math.round(product.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {product.reviewCount?.toLocaleString("fa-IR") || "۰"} نظر
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const percent =
                          star === 5
                            ? 72
                            : star === 4
                            ? 18
                            : star === 3
                            ? 6
                            : star === 2
                            ? 3
                            : 1;
                        return (
                          <div
                            key={star}
                            className="flex items-center gap-2"
                          >
                            <span className="text-[10px] text-muted-foreground w-3">
                              {star.toLocaleString("fa-IR")}
                            </span>
                            <Star className="size-2.5 fill-amber-400 text-amber-400" />
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground tabular-nums w-6">
                              {percent.toLocaleString("fa-IR")}٪
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* نمونه نظرات */}
                  <div className="space-y-2">
                    {sampleReviews.map((r, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-muted/30 p-2.5 border border-border/40"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-foreground">
                            {r.name}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={cn(
                                  "size-2.5",
                                  s <= r.stars
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/40"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                          {r.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* محصولات مرتبط */}
        {related.length > 0 && (
          <section className="pt-5">
            <div className="flex items-center justify-between px-4 mb-2">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="inline-block w-1 h-4 bg-primary rounded-full" />
                محصولات مرتبط
              </h2>
              <button
                type="button"
                onClick={() => setView("store")}
                className="text-[11px] text-primary font-medium flex items-center gap-0.5 hover:underline"
              >
                همه
                <ChevronLeft className="size-3.5" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2">
              {related.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => openProduct(p.id)}
                  className="shrink-0 w-36 text-right"
                >
                  <div
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center text-3xl mb-1",
                      p.bg
                    )}
                  >
                    {p.emoji}
                  </div>
                  <div className="text-[11px] font-bold line-clamp-2 leading-tight">
                    {p.name}
                  </div>
                  <div className="text-[11px] font-bold text-primary tabular-nums mt-0.5">
                    {p.price}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* فوتر */}
        <footer className="px-4 py-6 text-center">
          <div className="text-[11px] text-muted-foreground">
            فروشگاه شبکه قدس © ۱۴۰۴
          </div>
          <div className="text-[10px] text-muted-foreground/70 mt-0.5">
            ارائه شده توسط رسا نشر
          </div>
        </footer>
      </main>

      {/* نوار خرید چسبان پایین */}
      <div className="sticky bottom-0 z-30 bg-card/95 backdrop-blur border-t border-border/70 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="px-4 py-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding || added}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl shadow-md transition-all text-sm",
              added
                ? "bg-emerald-500 text-white"
                : adding
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground active:scale-[0.98]"
            )}
          >
            {added ? (
              <>
                <CheckCircle2 className="size-4" />
                به سبد اضافه شد
              </>
            ) : adding ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                در حال افزودن…
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" />
                افزودن به سبد
              </>
            )}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1 bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-md active:scale-95 transition-transform text-sm"
          >
            خرید سریع
          </button>
        </div>
      </div>
    </>
  );
}

const sampleReviews = [
  {
    name: "محمد ر.",
    stars: 5,
    text: "کیفیت محصول عالی بود، دقیقا مطابق توضیحات. ارسال هم سریع بود.",
  },
  {
    name: "زهرا ک.",
    stars: 4,
    text: "کیفیت خوب ولی بسته‌بندی می‌توانست بهتر باشد. در مجموع راضی‌ام.",
  },
  {
    name: "علی م.",
    stars: 5,
    text: "پشتیبانی فروشنده عالی. بعد از خرید هم راهنمایی کردند.",
  },
];

// محاسبه تقریبی قسط ماهانه
function estimateInstallment(priceStr: string, installmentLabel: string): string {
  // استخراج عدد از رشته فارسی
  const cleaned = priceStr
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[^\d]/g, "");
  const total = parseInt(cleaned) || 0;
  // استخراج تعداد ماه‌ها از label مثلاً «۱۲ ماه قسطی»
  const monthsMatch = installmentLabel.match(/(\d+)/);
  const months = monthsMatch ? parseInt(monthsMatch[1]) : 12;
  if (total === 0 || months === 0) return "—";
  const perMonth = Math.round(total / months / 1000) * 1000;
  return perMonth.toLocaleString("fa-IR") + " تومان در ماه";
}
