"use client";

import { useEffect, useMemo, useState } from "react";
import { products as fallbackProducts, storeCategories, type ProductItem } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useNav } from "@/lib/nav-store";
import {
  ChevronRight,
  Search,
  Star,
  Wallet,
  ShoppingBag,
  SlidersHorizontal,
  Flame,
  ChevronLeft,
  Truck,
} from "lucide-react";

type SortKey = "newest" | "price-asc" | "price-desc" | "rating";

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "newest", label: "پیشنهادها" },
  { id: "price-asc", label: "ارزان‌ترین" },
  { id: "price-desc", label: "گران‌ترین" },
  { id: "rating", label: "بالاترین امتیاز" },
];

function priceToNumber(s: string): number {
  const cleaned = s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[^\d]/g, "");
  return parseInt(cleaned) || 0;
}

export function StorePage() {
  const setView = useNav((s) => s.setView);
  const openProduct = useNav((s) => s.openProduct);
  const [products, setProducts] = useState<ProductItem[]>(fallbackProducts);
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [query, setQuery] = useState("");

  // بارگذاری محصولات از دیتابیس
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/public/products");
        const data = await res.json();
        if (active && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch {
        // fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const featured = useMemo(
    () =>
      products
        .filter((p) => p.discount && p.discount >= 10)
        .slice()
        .sort((a, b) => (b.discount || 0) - (a.discount || 0)),
    [products]
  );

  const filtered = useMemo(() => {
    let list = products.slice();
    if (category !== "all")
      list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.trim();
      list = list.filter(
        (p) =>
          p.name.includes(q) ||
          p.brand.includes(q) ||
          p.categoryLabel.includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "price-asc") return priceToNumber(a.price) - priceToNumber(b.price);
      if (sort === "price-desc") return priceToNumber(b.price) - priceToNumber(a.price);
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });
    return list;
  }, [products, category, sort, query]);

  const stats = useMemo(() => {
    const withDiscount = products.filter((p) => p.discount).length;
    const freeShip = products.filter((p) => p.freeShipping).length;
    return { total: products.length, withDiscount, freeShip };
  }, [products]);

  return (
    <>
      {/* هدر صفحه */}
      <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
        <div className="px-4 pt-3 pb-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("home")}
            aria-label="بازگشت به خانه"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold">فروشگاه قدس</h1>
            <p className="text-[11px] text-white/80">
              {stats.total.toLocaleString("fa-IR")} محصول ·{" "}
              {stats.withDiscount.toLocaleString("fa-IR")} تخفیف‌دار
            </p>
          </div>
          <button
            type="button"
            aria-label="سبد خرید"
            className="relative size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <ShoppingBag className="size-4.5" />
            <span className="absolute -top-1 -right-1 size-4 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-primary">
              ۳
            </span>
          </button>
        </div>

        {/* جعبه جستجو */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white/95 rounded-xl px-3 py-2.5 shadow-sm">
            <Search className="size-4.5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی محصول، برند، دسته‌بندی…"
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              aria-label="فیلتر پیشرفته"
              className="text-primary/70 hover:text-primary transition-colors"
            >
              <SlidersHorizontal className="size-4.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {/* بنر خرید قسطی */}
        <section className="px-4 pt-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white p-4 shadow-md">
            <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-white/10 blur-lg" />
            <div className="relative flex items-center gap-3">
              <div className="text-4xl shrink-0">💳</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold leading-snug">
                  خرید قسطی بدون پیش‌پرداخت
                </h3>
                <p className="text-[11px] text-white/85 mt-0.5 line-clamp-1">
                  تا ۲۴ ماه برای تمام محصولات فروشگاه قدس
                </p>
              </div>
              <button
                type="button"
                className="bg-white text-primary text-[11px] font-bold px-3 py-1.5 rounded-lg shadow active:scale-95 transition-transform"
              >
                مشاهده
              </button>
            </div>
          </div>
        </section>

        {/* آمار سریع */}
        <section className="px-4 pt-3">
          <div className="grid grid-cols-3 gap-2">
            <StatCard
              value={stats.total.toLocaleString("fa-IR")}
              label="محصول"
              emoji="📦"
              tone="bg-card border-border/70"
            />
            <StatCard
              value={stats.withDiscount.toLocaleString("fa-IR")}
              label="تخفیف‌دار"
              emoji="🏷️"
              tone="bg-rose-50 border-rose-100"
            />
            <StatCard
              value={stats.freeShip.toLocaleString("fa-IR")}
              label="ارسال رایگان"
              emoji="🚚"
              tone="bg-emerald-50 border-emerald-100"
            />
          </div>
        </section>

        {/* چیپ‌های دسته‌بندی */}
        <section className="pt-4">
          <div className="px-4 mb-2">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="inline-block w-1 h-4 bg-primary rounded-full" />
              دسته‌بندی محصولات
            </h2>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
            {storeCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  category === c.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-card border border-border/70 text-foreground hover:bg-muted"
                )}
              >
                <span>{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>
        </section>

        {/* پیشنهادهای ویژه */}
        {category === "all" && !query && featured.length > 0 && (
          <section aria-label="پیشنهادهای ویژه" className="pt-5">
            <div className="flex items-center justify-between px-4 mb-2">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Flame className="size-4 text-orange-500" />
                تخفیف‌های ویژه
              </h2>
              <button
                type="button"
                className="text-[11px] text-primary font-medium flex items-center gap-0.5 hover:underline"
              >
                همه
                <ChevronLeft className="size-3.5" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2 snap-x">
              {featured.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  variant="horizontal"
                  onClick={() => openProduct(p.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* نوار مرتب‌سازی و تعداد */}
        <section className="px-4 pt-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="inline-block w-1 h-4 bg-primary rounded-full" />
              {category === "all"
                ? "همه محصولات"
                : storeCategories.find((c) => c.id === category)?.label}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {filtered.length.toLocaleString("fa-IR")} محصول یافت شد
            </p>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground bg-card border border-border/70 rounded-lg px-2.5 py-1.5 hover:bg-muted transition-colors"
            >
              {sortOptions.find((s) => s.id === sort)?.label}
            </button>
            {sortOpen && (
              <div className="absolute left-0 mt-1 z-20 w-40 bg-card border border-border/70 rounded-xl shadow-lg overflow-hidden">
                {sortOptions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSort(s.id);
                      setSortOpen(false);
                    }}
                    className={cn(
                      "w-full text-right px-3 py-2 text-xs hover:bg-muted transition-colors",
                      sort === s.id
                        ? "font-bold text-primary bg-primary/5"
                        : "text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* لیست محصولات */}
        <section className="px-4 pt-3 pb-4 grid grid-cols-2 gap-3">
          {filtered.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              <div className="text-5xl mb-2">📦</div>
              <p className="text-sm">محصولی مطابق با جستجوی شما یافت نشد</p>
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setQuery("");
                }}
                className="mt-3 text-xs text-primary font-bold hover:underline"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                variant="vertical"
                onClick={() => openProduct(p.id)}
              />
            ))
          )}
        </section>

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
    </>
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

function ProductCard({
  product: p,
  variant = "vertical",
  onClick,
}: {
  product: ProductItem;
  variant?: "vertical" | "horizontal";
  onClick?: () => void;
}) {
  if (variant === "horizontal") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "snap-start shrink-0 w-44 text-right rounded-2xl bg-card border border-border/70 shadow-sm",
          "hover:shadow-md transition-shadow overflow-hidden"
        )}
      >
        <div className={cn("relative aspect-square flex items-center justify-center text-5xl", p.bg)}>
          {p.emoji}
          {p.discount && (
            <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow">
              ٪{p.discount.toLocaleString("fa-IR")}
            </span>
          )}
        </div>
        <div className="p-3">
          <span className="text-[10px] text-muted-foreground font-medium">
            {p.brand}
          </span>
          <h4 className="text-xs font-bold leading-snug line-clamp-2 mt-0.5 min-h-[2rem]">
            {p.name}
          </h4>
          <div className="mt-1 flex items-center gap-1">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold tabular-nums">
              {p.rating.toLocaleString("fa-IR")}
            </span>
          </div>
          <p className="mt-1 text-sm font-extrabold text-primary tabular-nums">
            {p.price}
          </p>
        </div>
      </button>
    );
  }

  // کارت عمودی برای گرید
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-right rounded-2xl bg-card border border-border/70 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      <div className={cn("relative aspect-square flex items-center justify-center text-5xl", p.bg)}>
        {p.emoji}
        {p.discount && (
          <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow">
            ٪{p.discount.toLocaleString("fa-IR")} تخفیف
          </span>
        )}
        {p.freeShipping && (
          <span className="absolute bottom-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow">
            <Truck className="size-2.5" />
            ارسال رایگان
          </span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <span className="text-[10px] text-muted-foreground font-medium">
          {p.brand}
        </span>
        <h4 className="text-xs font-bold leading-snug line-clamp-2 mt-0.5 min-h-[2rem]">
          {p.name}
        </h4>
        <div className="mt-1.5 flex items-center gap-1">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-bold tabular-nums">
            {p.rating.toLocaleString("fa-IR")}
          </span>
          <span className="text-[10px] text-muted-foreground">
            ({p.soldCount} فروش)
          </span>
        </div>
        <div className="mt-2 space-y-0.5">
          {p.originalPrice && (
            <span className="text-[10px] text-muted-foreground line-through tabular-nums block">
              {p.originalPrice}
            </span>
          )}
          <p className="text-sm font-extrabold text-primary tabular-nums">
            {p.price}
          </p>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-1 rounded-md self-start">
          <Wallet className="size-3" />
          <span className="font-medium">{p.installment}</span>
        </div>
      </div>
    </button>
  );
}
