"use client";

import { useEffect, useMemo, useState } from "react";
import { restaurants as fallbackRestaurants, foodCategories, type Restaurant } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useNav } from "@/lib/nav-store";
import {
  ChevronRight,
  Search,
  Star,
  Clock,
  Truck,
  MapPin,
  SlidersHorizontal,
  Flame,
  ChevronLeft,
} from "lucide-react";

type SortKey = "newest" | "rating" | "delivery";

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "newest", label: "پیشنهادها" },
  { id: "rating", label: "بالاترین امتیاز" },
  { id: "delivery", label: "سریع‌ترین ارسال" },
];

export function FoodOrderPage() {
  const setView = useNav((s) => s.setView);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(fallbackRestaurants);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [query, setQuery] = useState("");

  // بارگذاری رستوران‌ها از دیتابیس
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/public/restaurants");
        const data = await res.json();
        if (active && Array.isArray(data.restaurants) && data.restaurants.length > 0) {
          setRestaurants(data.restaurants);
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
    () => restaurants.filter((r) => r.featured && r.isOpen),
    [restaurants]
  );

  const filtered = useMemo(() => {
    let list = restaurants.slice();
    if (activeCategory !== "all") {
      const cat = foodCategories.find((c) => c.id === activeCategory);
      if (cat) list = list.filter((r) => r.category === cat.label);
    }
    if (query.trim()) {
      const q = query.trim();
      list = list.filter(
        (r) =>
          r.name.includes(q) ||
          r.category.includes(q) ||
          r.tags.some((t) => t.includes(q))
      );
    }
    list.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "delivery") {
        // ساده‌سازی: بر اساس عدد ابتدایی زمان تحویل
        const aT = parseInt(a.deliveryTime.replace(/[^\d]/g, "")) || 99;
        const bT = parseInt(b.deliveryTime.replace(/[^\d]/g, "")) || 99;
        return aT - bT;
      }
      // newest = featured اول، بقیه بر اساس امتیاز
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
    return list;
  }, [restaurants, activeCategory, sort, query]);

  const stats = useMemo(() => {
    const open = restaurants.filter((r) => r.isOpen).length;
    const withDiscount = restaurants.filter((r) => r.discount).length;
    return { total: restaurants.length, open, withDiscount };
  }, [restaurants]);

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
            <h1 className="text-base font-bold">سفارش غذا</h1>
            <p className="text-[11px] text-white/80">
              {stats.open.toLocaleString("fa-IR")} رستوران باز از{" "}
              {stats.total.toLocaleString("fa-IR")}
            </p>
          </div>
          <button
            type="button"
            aria-label="فیلتر"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <SlidersHorizontal className="size-4.5" />
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
              placeholder="جستجوی رستوران، غذا، دسته‌بندی…"
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {/* بنر آدرس */}
        <section className="px-4 pt-3">
          <div className="flex items-center gap-2 bg-card border border-border/70 rounded-xl p-2.5 shadow-sm">
            <div className="size-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              <MapPin className="size-4.5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-muted-foreground">آدرس تحویل</div>
              <div className="text-xs font-bold text-foreground truncate">
                قدس، شهرک قدس، خیابان مطهری، پلاک ۱۲
              </div>
            </div>
            <button
              type="button"
              className="text-[11px] text-primary font-bold hover:underline shrink-0"
            >
              تغییر
            </button>
          </div>
        </section>

        {/* دسته‌بندی‌ها — گرید ۴ ستونی */}
        <section aria-label="دسته‌بندی غذا" className="px-4 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="inline-block w-1 h-4 bg-primary rounded-full" />
              دسته‌بندی غذا
            </h2>
            <button
              type="button"
              className="text-[11px] text-primary font-medium flex items-center gap-0.5 hover:underline"
            >
              همه
              <ChevronLeft className="size-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {foodCategories.map((c) => {
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    setActiveCategory(isActive ? "all" : c.id)
                  }
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-xl border transition-all",
                    isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "size-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-sm",
                      c.gradient
                    )}
                  >
                    {c.emoji}
                  </div>
                  <span className="text-[10px] font-bold text-foreground text-center leading-tight line-clamp-1">
                    {c.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground tabular-nums">
                    {c.count.toLocaleString("fa-IR")} رستوران
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* پیشنهادهای ویژه */}
        {activeCategory === "all" && !query && (
          <section aria-label="پیشنهادهای ویژه" className="pt-5">
            <div className="flex items-center justify-between px-4 mb-2">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Flame className="size-4 text-orange-500" />
                پیشنهادهای ویژه امروز
              </h2>
              <button
                type="button"
                className="text-[11px] text-primary font-medium flex items-center gap-0.5 hover:underline"
              >
                همه
                <ChevronLeft className="size-3.5" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2">
              {featured.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  variant="horizontal"
                />
              ))}
            </div>
          </section>
        )}

        {/* نوار مرتب‌سازی */}
        <section className="px-4 pt-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="inline-block w-1 h-4 bg-primary rounded-full" />
              {activeCategory === "all"
                ? "همه رستوران‌ها"
                : foodCategories.find((c) => c.id === activeCategory)?.label}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {filtered.length.toLocaleString("fa-IR")} رستوران یافت شد
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

        {/* لیست رستوران‌ها */}
        <section className="px-4 pt-3 space-y-3 pb-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-5xl mb-2">🍽️</div>
              <p className="text-sm">رستورانی مطابق با جستجوی شما یافت نشد</p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setQuery("");
                }}
                className="mt-3 text-xs text-primary font-bold hover:underline"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            filtered.map((r) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                variant="vertical"
              />
            ))
          )}
        </section>

        {/* فوتر */}
        <footer className="px-4 py-6 text-center">
          <div className="text-[11px] text-muted-foreground">
            سفارش غذا شبکه قدس © ۱۴۰۴
          </div>
          <div className="text-[10px] text-muted-foreground/70 mt-0.5">
            ارائه شده توسط رسا نشر
          </div>
        </footer>
      </main>
    </>
  );
}

function RestaurantCard({
  restaurant: r,
  variant = "vertical",
}: {
  restaurant: Restaurant;
  variant?: "vertical" | "horizontal";
}) {
  if (variant === "horizontal") {
    // کارت افقی برای بخش پیشنهادهای ویژه
    return (
      <article
        className={cn(
          "shrink-0 w-64 rounded-2xl bg-card border border-border/70 shadow-sm",
          "overflow-hidden hover:shadow-md transition-shadow"
        )}
      >
        <div
          className={cn(
            "relative h-24 bg-gradient-to-br flex items-center justify-center",
            r.coverGradient
          )}
        >
          <span className="text-5xl drop-shadow">{r.categoryEmoji}</span>
          {r.discount && (
            <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow">
              ٪{r.discount.toLocaleString("fa-IR")} تخفیف
            </span>
          )}
          <span className="absolute top-2 left-2 bg-white/95 backdrop-blur text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">
              {r.rating.toLocaleString("fa-IR")}
            </span>
          </span>
        </div>
        <div className="p-3">
          <h4 className="text-xs font-bold leading-snug line-clamp-1">
            {r.name}
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
            {r.description}
          </p>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Clock className="size-3" />
              {r.deliveryTime}
            </span>
            <span className="flex items-center gap-0.5">
              <Truck className="size-3" />
              {r.deliveryFee}
            </span>
          </div>
        </div>
      </article>
    );
  }

  // کارت عمودی برای لیست اصلی
  return (
    <article className="rounded-2xl bg-card border border-border/70 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* تصویر کاور */}
      <div
        className={cn(
          "relative h-28 bg-gradient-to-br flex items-center justify-center",
          r.coverGradient
        )}
      >
        <span className="text-6xl drop-shadow-lg">{r.categoryEmoji}</span>

        {/* نشان باز/بسته */}
        <span
          className={cn(
            "absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md shadow",
            r.isOpen
              ? "bg-emerald-500 text-white"
              : "bg-slate-500 text-white"
          )}
        >
          {r.isOpen ? "باز" : "بسته"}
        </span>

        {/* تخفیف */}
        {r.discount && (
          <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
            ٪{r.discount.toLocaleString("fa-IR")} تخفیف
          </span>
        )}

        {/* ویژه */}
        {r.featured && (
          <span className="absolute bottom-2 left-2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow flex items-center gap-0.5">
            <Flame className="size-2.5" />
            ویژه
          </span>
        )}
      </div>

      <div className="p-3">
        {/* نام و امتیاز */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-snug flex-1 line-clamp-1">
            {r.name}
          </h3>
          <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 text-[11px] font-bold px-1.5 py-0.5 rounded-md tabular-nums shrink-0">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {r.rating.toLocaleString("fa-IR")}
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
          {r.description}
        </p>

        {/* برچسب‌ها */}
        <div className="mt-2 flex flex-wrap gap-1">
          {r.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-[10px] bg-muted/70 text-foreground/80 px-1.5 py-0.5 rounded"
            >
              {t}
            </span>
          ))}
        </div>

        {/* اطلاعات تحویل */}
        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5 text-primary/70" />
              <span className="tabular-nums">{r.deliveryTime}</span>
            </span>
            <span className="flex items-center gap-1">
              <Truck className="size-3.5 text-primary/70" />
              {r.deliveryFee}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            حداقل سفارش:{" "}
            <span className="font-bold text-foreground tabular-nums">
              {r.minOrder}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
