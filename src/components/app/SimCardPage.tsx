"use client";

import { useMemo, useState } from "react";
import {
  simCards,
  simOperators,
  simTypes,
  type SimCardListing,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { useNav } from "@/lib/nav-store";
import {
  ChevronRight,
  Search,
  MapPin,
  Clock,
  Phone,
  Star,
  BadgeCheck,
  ChevronLeft,
  Tag,
  ShoppingBag,
  User,
  CreditCard,
  Flame,
} from "lucide-react";

type TypeFilter = "all" | "new" | "used";
type SortKey = "newest" | "price-asc" | "price-desc";

const typeTabs: { id: TypeFilter; label: string; emoji: string }[] = [
  { id: "all", label: "همه", emoji: "📋" },
  { id: "new", label: "نو", emoji: "✨" },
  { id: "used", label: "کارکرده", emoji: "♻️" },
];

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "newest", label: "جدیدترین" },
  { id: "price-asc", label: "ارزان‌ترین" },
  { id: "price-desc", label: "گران‌ترین" },
];

function priceToNumber(s: string): number {
  const cleaned = s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[^\d]/g, "");
  return parseInt(cleaned) || 0;
}

export function SimCardPage() {
  const setView = useNav((s) => s.setView);
  const [type, setType] = useState<TypeFilter>("all");
  const [operator, setOperator] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = simCards.slice();
    if (type !== "all") list = list.filter((s) => s.type === type);
    if (operator !== "all") list = list.filter((s) => s.operator === operator);
    if (query.trim()) {
      const q = query.trim();
      list = list.filter(
        (s) =>
          s.number.includes(q) ||
          s.seller.name.includes(q) ||
          s.location.includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "price-asc") return priceToNumber(a.price) - priceToNumber(b.price);
      if (sort === "price-desc") return priceToNumber(b.price) - priceToNumber(a.price);
      return 0;
    });
    return list;
  }, [type, operator, sort, query]);

  const stats = useMemo(() => {
    const newCount = simCards.filter((s) => s.type === "new").length;
    const usedCount = simCards.filter((s) => s.type === "used").length;
    return { total: simCards.length, new: newCount, used: usedCount };
  }, []);

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
            <h1 className="text-base font-bold">سیم کارت</h1>
            <p className="text-[11px] text-white/80">
              {stats.total.toLocaleString("fa-IR")} آگهی فعال · {stats.new.toLocaleString("fa-IR")} نو · {stats.used.toLocaleString("fa-IR")} کارکرده
            </p>
          </div>
          <div className="size-9 rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/15">
            <CreditCard className="size-5" />
          </div>
        </div>

        {/* جعبه جستجو */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white/95 rounded-xl px-3 py-2.5 shadow-sm">
            <Search className="size-4.5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی شماره، فروشنده، مکان…"
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {/* تب فیلتر نوع */}
        <section className="px-4 pt-3">
          <div className="flex items-center gap-1.5 bg-card border border-border/70 rounded-xl p-1 shadow-sm">
            {typeTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={cn(
                  "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all",
                  type === t.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <span className="ml-1">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* چیپ‌های اپراتور */}
        <section className="pt-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
            <button
              type="button"
              onClick={() => setOperator("all")}
              className={cn(
                "shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                operator === "all"
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-card border border-border/70 text-foreground hover:bg-muted"
              )}
            >
              <span>📡</span>
              همه اپراتورها
            </button>
            {simOperators.map((op) => (
              <button
                key={op.id}
                type="button"
                onClick={() => setOperator(op.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  operator === op.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-card border border-border/70 text-foreground hover:bg-muted"
                )}
              >
                <span>{op.emoji}</span>
                {op.label}
              </button>
            ))}
          </div>
        </section>

        {/* نوار مرتب‌سازی */}
        <section className="px-4 pt-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="inline-block w-1 h-4 bg-primary rounded-full" />
              لیست سیم‌کارت‌ها
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

        {/* لیست سیم‌کارت‌ها */}
        <section className="px-4 pt-3 pb-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-5xl mb-2">📡</div>
              <p className="text-sm">سیم‌کارتی مطابق با فیلتر شما یافت نشد</p>
              <button
                type="button"
                onClick={() => {
                  setType("all");
                  setOperator("all");
                  setQuery("");
                }}
                className="mt-3 text-xs text-primary font-bold hover:underline"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            filtered.map((card) => (
              <SimCardCard key={card.id} card={card} />
            ))
          )}
        </section>

        {/* فوتر */}
        <footer className="px-4 py-6 text-center">
          <div className="text-[11px] text-muted-foreground">
            سیم کارت شبکه قدس © ۱۴۰۴
          </div>
          <div className="text-[10px] text-muted-foreground/70 mt-0.5">
            ارائه شده توسط رسا نشر
          </div>
        </footer>
      </main>
    </>
  );
}

function SimCardCard({ card }: { card: SimCardListing }) {
  return (
    <article className="rounded-2xl bg-card border border-border/70 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* بالای کارت: شماره + نشان‌ها */}
      <div className="relative bg-gradient-to-br from-muted to-muted/50 p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", card.operatorColor)}>
              {card.operatorEmoji} {card.operatorLabel}
            </span>
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", card.typeColor)}>
              {card.typeLabel}
            </span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <Clock className="size-3" />
            {card.timeAgo}
          </span>
        </div>

        {/* شماره سیم‌کارت در یک جعبه برجسته */}
        <div className="bg-card rounded-xl p-3 border border-border/70 text-center">
          <div className="text-[10px] text-muted-foreground mb-1">شماره سیم‌کارت</div>
          <div className="text-2xl font-extrabold tabular-nums tracking-wider text-primary" dir="ltr">
            {card.number}
          </div>
        </div>
      </div>

      <div className="p-3">
        {/* قیمت */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div>
            <div className="text-[10px] text-muted-foreground">قیمت</div>
            <div className="text-lg font-extrabold text-primary tabular-nums">
              {card.price}
            </div>
          </div>
          {card.features.some((f) => f.includes("رند")) && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded-md">
              <Flame className="size-3" />
              رند ویژه
            </span>
          )}
        </div>

        {/* ویژگی‌ها */}
        <div className="flex flex-wrap gap-1 mb-2">
          {card.features.map((f, i) => (
            <span key={i} className="text-[10px] bg-muted/70 text-foreground/80 px-1.5 py-0.5 rounded">
              {f}
            </span>
          ))}
        </div>

        {/* مکان */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-3">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">
            {card.location}
            {card.district ? ` · ${card.district}` : ""}
          </span>
        </div>

        {/* اطلاعات فروشنده */}
        <div className="pt-3 border-t border-border/60">
          <div className="flex items-center gap-2 mb-2">
            {/* آواتار فروشنده */}
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {card.seller.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-foreground truncate">
                  {card.seller.name}
                </span>
                {card.seller.verified && (
                  <BadgeCheck className="size-3.5 text-sky-500 shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                <span className="inline-flex items-center gap-0.5">
                  <Star className="size-2.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold tabular-nums">{card.seller.rating.toLocaleString("fa-IR")}</span>
                </span>
                <span>·</span>
                <span className="tabular-nums">
                  {card.seller.totalSales.toLocaleString("fa-IR")} فروش
                </span>
              </div>
            </div>
          </div>

          {/* دکمه‌های تماس */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-2 rounded-lg active:scale-95 transition-transform"
            >
              <Phone className="size-3.5" />
              تماس با فروشنده
            </button>
            <button
              type="button"
              className="size-9 rounded-lg bg-muted hover:bg-muted/70 flex items-center justify-center"
              aria-label="نمایش شماره"
            >
              <ShoppingBag className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
