"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";
import {
  ChevronRight,
  Search,
  MapPin,
  Clock,
  ChevronLeft,
  Plus,
  Phone,
  Sparkles,
  Zap,
} from "lucide-react";

type SortKey = "newest" | "price-asc" | "price-desc";

type Classified = {
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
  tags: string[];
  isPaid: boolean;
  plan: string;
  contactName: string | null;
  contactPhone: string | null;
  publishedAt: string | null;
};

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "newest", label: "جدیدترین" },
  { id: "price-asc", label: "ارزان‌ترین" },
  { id: "price-desc", label: "گران‌ترین" },
];

// استخراج عدد از رشته قیمت فارسی
function priceToNumber(s: string): number {
  const cleaned = s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[^\d]/g, "");
  return parseInt(cleaned) || 0;
}

export function ClassifiedsPage() {
  const setView = useNav((s) => s.setView);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  const [items, setItems] = useState<Classified[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [query, setQuery] = useState("");

  // بارگذاری آگهی‌های تأیید شده از دیتابیس
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/public/classifieds");
        const data = await res.json();
        if (active && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = items.slice();
    if (activeCategory !== "all") {
      list = list.filter((it) => it.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.trim();
      list = list.filter(
        (it) =>
          it.title.includes(q) ||
          it.description.includes(q) ||
          it.location.includes(q) ||
          it.tags.some((t) => t.includes(q))
      );
    }
    list.sort((a, b) => {
      if (sort === "price-asc") return priceToNumber(a.price) - priceToNumber(b.price);
      if (sort === "price-desc") return priceToNumber(b.price) - priceToNumber(a.price);
      // newest بر اساس publishedAt
      const aT = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bT = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bT - aT;
    });
    return list;
  }, [items, activeCategory, sort, query]);

  // دریافت دسته‌بندی‌های یکتا از لیست آگهی‌ها
  const categories = useMemo(() => {
    const map = new Map<string, { id: string; label: string }>();
    items.forEach((it) => {
      if (!map.has(it.category)) {
        map.set(it.category, { id: it.category, label: it.categoryLabel });
      }
    });
    return Array.from(map.values());
  }, [items]);

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
            <h1 className="text-base font-bold">نیازمندی‌ها</h1>
            <p className="text-[11px] text-white/80">
              {items.length.toLocaleString("fa-IR")} آگهی فعال
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView(isAuthenticated ? "post-classified" : "auth")}
            aria-label="ثبت آگهی"
            className="size-9 rounded-full bg-white text-primary hover:bg-white/90 transition-colors flex items-center justify-center shadow"
          >
            <Plus className="size-5" strokeWidth={2.5} />
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
              placeholder="جستجوی آگهی، کالا، مکان…"
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {/* بنر دعوت به ثبت آگهی */}
        {isAuthenticated && (
          <section className="px-4 pt-3">
            <button
              type="button"
              onClick={() => setView("post-classified")}
              className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-white p-4 shadow-md active:scale-[0.98] transition-transform"
            >
              <div className="pointer-events-none absolute -top-6 -left-6 size-24 rounded-full bg-white/10 blur-lg" />
              <div className="relative flex items-center gap-3">
                <div className="text-4xl shrink-0">📢</div>
                <div className="flex-1 text-right">
                  <h3 className="text-sm font-bold">آگهی خود را ثبت کنید</h3>
                  <p className="text-[11px] text-white/85 mt-0.5">
                    رایگان، ویژه یا فوری — در عرض چند دقیقه
                  </p>
                </div>
                <ChevronLeft className="size-5" />
              </div>
            </button>
          </section>
        )}

        {!isAuthenticated && (
          <section className="px-4 pt-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
              <Sparkles className="size-5 text-amber-600 shrink-0" />
              <p className="text-[11px] text-amber-800">
                برای ثبت آگهی، ابتدا با شماره موبایل وارد شوید.
              </p>
            </div>
          </section>
        )}

        {/* چیپ‌های دسته‌بندی */}
        {categories.length > 0 && (
          <section className="pt-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  activeCategory === "all"
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-card border border-border/70 text-foreground hover:bg-muted"
                )}
              >
                <span>📦</span>
                همه
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(c.id)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    activeCategory === c.id
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-card border border-border/70 text-foreground hover:bg-muted"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* نوار مرتب‌سازی */}
        <section className="px-4 pt-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="inline-block w-1 h-4 bg-primary rounded-full" />
              {activeCategory === "all"
                ? "همه آگهی‌ها"
                : categories.find((c) => c.id === activeCategory)?.label}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {filtered.length.toLocaleString("fa-IR")} آگهی یافت شد
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

        {/* لیست آگهی‌ها */}
        <section className="px-4 pt-3 pb-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-5xl mb-2">📭</div>
              <p className="text-sm">آگهی‌ای مطابق با جستجوی شما یافت نشد</p>
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
            filtered.map((it) => (
              <ClassifiedCard key={it.id} item={it} />
            ))
          )}
        </section>

        {/* دکمه شناور ثبت آگهی */}
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => setView("post-classified")}
            className="lg:hidden fixed bottom-20 right-4 z-30 size-14 rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform flex items-center justify-center"
            aria-label="ثبت آگهی جدید"
          >
            <Plus className="size-6" strokeWidth={2.5} />
          </button>
        )}

        {/* فوتر */}
        <footer className="px-4 py-6 text-center">
          <div className="text-[11px] text-muted-foreground">
            نیازمندی‌های شبکه قدس © ۱۴۰۴
          </div>
          <div className="text-[10px] text-muted-foreground/70 mt-0.5">
            ارائه شده توسط رسا نشر
          </div>
        </footer>
      </main>
    </>
  );
}

function ClassifiedCard({ item }: { item: Classified }) {
  return (
    <article className="rounded-2xl bg-card border border-border/70 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-3">
        <div className="flex items-start gap-3">
          {/* تصویر آگهی — اموجی روی پس‌زمینه رنگی */}
          <div
            className={cn(
              "size-20 rounded-xl flex items-center justify-center text-4xl shrink-0 ring-1",
              item.badgeColor || "bg-muted"
            )}
          >
            {item.emoji}
          </div>

          <div className="flex-1 min-w-0">
            {/* نشان‌ها */}
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                  item.badgeColor
                )}
              >
                {item.categoryLabel}
              </span>
              {item.isPaid && item.plan === "featured" && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Sparkles className="size-2.5" />
                  ویژه
                </span>
              )}
              {item.isPaid && item.plan === "urgent" && (
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Zap className="size-2.5" />
                  فوری
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold leading-snug line-clamp-2">
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* قیمت */}
        <div className="mt-2 text-sm font-extrabold text-primary tabular-nums">
          {item.price}
        </div>

        {/* برچسب‌ها */}
        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.slice(0, 4).map((t, i) => (
              <span
                key={i}
                className="text-[10px] bg-muted/70 text-foreground/80 px-1.5 py-0.5 rounded"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* مکان و زمان */}
        <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground min-w-0">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">
              {item.location}
              {item.district ? ` · ${item.district}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
            <Clock className="size-3" />
            {item.timeAgo}
          </div>
        </div>

        {/* فوتر کارت: تماس */}
        <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            {item.contactName && (
              <div className="text-[11px] font-bold text-foreground truncate">
                {item.contactName}
              </div>
            )}
            {item.contactPhone && (
              <div className="text-[10px] text-muted-foreground tabular-nums" dir="ltr">
                {item.contactPhone}
              </div>
            )}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
          >
            <Phone className="size-3.5" />
            تماس
          </button>
        </div>
      </div>
    </article>
  );
}
