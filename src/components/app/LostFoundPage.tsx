"use client";

import { useEffect, useMemo, useState } from "react";
import {
  lostFoundItems as fallbackItems,
  lostFoundCategories,
  type LostFoundItem,
  type LostFoundStatus,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { useNav } from "@/lib/nav-store";
import {
  ChevronRight,
  Search,
  MapPin,
  Clock,
  Calendar,
  Gift,
  Phone,
  Bookmark,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
  User,
  ShieldCheck,
} from "lucide-react";

type StatusFilter = "all" | LostFoundStatus;
type SortKey = "newest" | "reward";

const statusFilters: {
  id: StatusFilter;
  label: string;
  emoji: string;
}[] = [
  { id: "all", label: "همه", emoji: "📋" },
  { id: "lost", label: "گم‌شده", emoji: "❌" },
  { id: "found", label: "پیدا‌شده", emoji: "✅" },
];

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "newest", label: "جدیدترین" },
  { id: "reward", label: "دارای پاداش" },
];

// ترجمه تاریخ شمسی به عدد برای مرتب‌سازی (ساده)
function dateToNumber(s: string): number {
  const clean = s.replace(/[/_-]/g, "");
  return parseInt(clean.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))) || 0;
}

export function LostFoundPage() {
  const setView = useNav((s) => s.setView);

  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(fallbackItems);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  // بارگذاری اشیاء گمشده از دیتابیس
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/public/lost-found");
        const data = await res.json();
        if (active && Array.isArray(data.items) && data.items.length > 0) {
          setLostFoundItems(data.items);
        }
      } catch {
        // fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = lostFoundItems.slice();
    if (status !== "all") list = list.filter((p) => p.status === status);
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.trim();
      list = list.filter(
        (p) =>
          p.title.includes(q) ||
          p.description.includes(q) ||
          p.location.includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    if (sort === "reward") {
      list.sort((a, b) => {
        if (a.reward && !b.reward) return -1;
        if (!a.reward && b.reward) return 1;
        return dateToNumber(b.date) - dateToNumber(a.date);
      });
    } else {
      list.sort((a, b) => dateToNumber(b.date) - dateToNumber(a.date));
    }
    return list;
  }, [lostFoundItems, status, category, sort, query]);

  const stats = useMemo(() => {
    const lost = lostFoundItems.filter((p) => p.status === "lost").length;
    const found = lostFoundItems.filter((p) => p.status === "found").length;
    const withReward = lostFoundItems.filter((p) => p.reward).length;
    return { total: lostFoundItems.length, lost, found, withReward };
  }, [lostFoundItems]);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
            <h1 className="text-base font-bold">اشیاء گمشده شهر قدس</h1>
            <p className="text-[11px] text-white/80">
              {stats.total.toLocaleString("fa-IR")} مورد فعال
            </p>
          </div>
          <button
            type="button"
            aria-label="جستجوی پیشرفته"
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
              placeholder="جستجوی وسیله، مکان، برچسب…"
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {/* نوار راهنما */}
        <section className="px-4 pt-3">
          <div className="flex items-start gap-2 bg-sky-50 border border-sky-100 rounded-xl p-3">
            <ShieldCheck className="size-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[11px] font-bold text-sky-900">
                هشدار امنیتی
              </p>
              <p className="text-[10px] text-sky-800/80 leading-relaxed mt-0.5">
                پیش از تحویل وسیله، هویت طرف مقابل را احراز کنید. در موارد حساس (مدارک هویتی، جواهرات) حتماً به کلانتری مراجعه کنید.
              </p>
            </div>
          </div>
        </section>

        {/* آمار سریع */}
        <section className="px-4 pt-3">
          <div className="grid grid-cols-3 gap-2">
            <StatCard
              label="گم‌شده"
              value={stats.lost.toLocaleString("fa-IR")}
              emoji="❌"
              tone="bg-rose-50 border-rose-100"
            />
            <StatCard
              label="پیدا‌شده"
              value={stats.found.toLocaleString("fa-IR")}
              emoji="✅"
              tone="bg-emerald-50 border-emerald-100"
            />
            <StatCard
              label="دارای پاداش"
              value={stats.withReward.toLocaleString("fa-IR")}
              emoji="🎁"
              tone="bg-amber-50 border-amber-100"
            />
          </div>
        </section>

        {/* تب فیلتر وضعیت */}
        <section className="px-4 pt-3">
          <div className="flex items-center gap-1.5 bg-card border border-border/70 rounded-xl p-1 shadow-sm">
            {statusFilters.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatus(s.id)}
                className={cn(
                  "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all",
                  status === s.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <span className="ml-1">{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* چیپ‌های دسته‌بندی */}
        <section className="pt-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
            {lostFoundCategories.map((c) => (
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

        {/* نوار مرتب‌سازی */}
        <section className="px-4 pt-3 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {filtered.length.toLocaleString("fa-IR")} مورد یافت شد
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground bg-card border border-border/70 rounded-lg px-2.5 py-1.5 hover:bg-muted transition-colors"
            >
              {sort === "reward" ? "🎁 " : ""}
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
        <section className="px-4 pt-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-5xl mb-2">🔍</div>
              <p className="text-sm">موردی مطابق با فیلتر شما یافت نشد</p>
              <button
                type="button"
                onClick={() => {
                  setStatus("all");
                  setCategory("all");
                  setQuery("");
                }}
                className="mt-3 text-xs text-primary font-bold hover:underline"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            filtered.map((item) => (
              <LostFoundCard
                key={item.id}
                item={item}
                bookmarked={bookmarked.has(item.id)}
                onBookmark={() => toggleBookmark(item.id)}
              />
            ))
          )}
        </section>

        {/* دکمه‌های ثبت */}
        <section className="px-4 pt-4 pb-2 space-y-2">
          <button
            type="button"
            className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <AlertCircle className="size-5" />
            ثبت وسیله گم‌شده
          </button>
          <button
            type="button"
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="size-5" />
            ثبت وسیله پیدا‌شده
          </button>
        </section>

        {/* فوتر */}
        <footer className="px-4 py-6 text-center">
          <div className="text-[11px] text-muted-foreground">
            اشیاء گمشده شبکه قدس © ۱۴۰۴
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
  label,
  value,
  emoji,
  tone,
}: {
  label: string;
  value: string;
  emoji: string;
  tone: string;
}) {
  return (
    <div className={cn("rounded-xl p-3 border shadow-sm", tone)}>
      <div className="text-xl">{emoji}</div>
      <div className="mt-1 text-base font-extrabold text-foreground tabular-nums">
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function LostFoundCard({
  item,
  bookmarked,
  onBookmark,
}: {
  item: LostFoundItem;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  const isLost = item.status === "lost";

  return (
    <article className="rounded-2xl bg-card border border-border/70 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* نوار رنگی بالا برای تمایز گم‌شده/پیدا‌شده */}
      <div
        className={cn(
          "h-1.5",
          isLost ? "bg-rose-500" : "bg-emerald-500"
        )}
      />

      <div className="p-3">
        {/* هدر کارت: آیکن + نشان وضعیت + بوک‌مارک */}
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "size-14 rounded-xl flex items-center justify-center text-3xl shrink-0 ring-1",
              isLost
                ? "bg-rose-50 ring-rose-100"
                : "bg-emerald-50 ring-emerald-100"
            )}
          >
            {item.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-md",
                  isLost
                    ? "bg-rose-500 text-white"
                    : "bg-emerald-500 text-white"
                )}
              >
                {isLost ? "گم‌شده" : "پیدا‌شده"}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-muted",
                  "text-foreground/80"
                )}
              >
                {item.categoryLabel}
              </span>
            </div>
            <h3 className="text-sm font-bold leading-snug line-clamp-2">
              {item.title}
            </h3>
          </div>

          {/* بوک‌مارک */}
          <button
            type="button"
            onClick={onBookmark}
            aria-label="ذخیره مورد"
            className="size-8 rounded-full bg-muted/50 hover:bg-muted transition-colors flex items-center justify-center shrink-0"
          >
            <Bookmark
              className={cn(
                "size-4 transition-colors",
                bookmarked ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
              )}
            />
          </button>
        </div>

        {/* توضیحات */}
        <p className="mt-2 text-[12px] text-foreground/80 leading-relaxed line-clamp-3">
          {item.description}
        </p>

        {/* پاداش */}
        {item.reward && (
          <div className="mt-2 flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
            <Gift className="size-4 text-amber-600" />
            <span className="text-[11px] font-bold text-amber-800">
              {item.reward}
            </span>
          </div>
        )}

        {/* برچسب‌ها */}
        <div className="mt-2 flex flex-wrap gap-1">
          {item.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] bg-muted/70 text-foreground/80 px-1.5 py-0.5 rounded"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* اطلاعات مکان و تاریخ */}
        <div className="mt-3 pt-2.5 border-t border-border/60 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-primary/70" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary/70" />
              <span className="tabular-nums">{item.date}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {item.timeAgo}
            </span>
          </div>
        </div>

        {/* فوتر کارت: اطلاعات تماس + دکمه */}
        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <div
              className={cn(
                "size-7 rounded-full flex items-center justify-center shrink-0",
                isLost ? "bg-rose-50" : "bg-emerald-50"
              )}
            >
              <User
                className={cn(
                  "size-3.5",
                  isLost ? "text-rose-600" : "text-emerald-600"
                )}
              />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-muted-foreground">
                {item.contactType === "owner" ? "مالک" : "یابنده"}
              </div>
              <div className="text-[11px] font-bold text-foreground truncate">
                {item.contactName}
              </div>
            </div>
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
