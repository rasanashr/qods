"use client";

import { useEffect, useMemo, useState } from "react";
import {
  properties as fallbackProperties,
  propertyTypeFilters,
  type PropertyListing,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { useNav } from "@/lib/nav-store";
import {
  ChevronRight,
  Search,
  MapPin,
  Clock,
  Maximize2,
  BedDouble,
  Building2 as BuildingIcon,
  Car,
  ArrowUpDown,
  SlidersHorizontal,
  Phone,
  Bookmark,
} from "lucide-react";

type DealFilter = "all" | "sale" | "rent";
type SortKey = "newest" | "price-asc" | "price-desc" | "area-desc";

const dealFilters: { id: DealFilter; label: string; emoji: string }[] = [
  { id: "all", label: "همه", emoji: "📋" },
  { id: "sale", label: "فروش", emoji: "💰" },
  { id: "rent", label: "رهن و اجاره", emoji: "🔑" },
];

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "newest", label: "جدیدترین" },
  { id: "price-desc", label: "بالاترین قیمت" },
  { id: "price-asc", label: "پایین‌ترین قیمت" },
  { id: "area-desc", label: "بیشترین متراژ" },
];

// استخراج عدد از رشته قیمت برای مرتب‌سازی (میلیارد/میلیون)
function priceToNumber(s: string): number {
  const num = parseFloat(s.replace(/[^۰-۹0-9.]/g, "").replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))));
  if (s.includes("میلیارد")) return num * 1000;
  if (s.includes("میلیون")) return num;
  return num;
}

export function AmlakPage() {
  const setView = useNav((s) => s.setView);

  const [properties, setProperties] = useState<PropertyListing[]>(fallbackProperties);
  const [deal, setDeal] = useState<DealFilter>("all");
  const [type, setType] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  // بارگذاری آگهی‌ها از دیتابیس
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/public/properties");
        const data = await res.json();
        if (active && Array.isArray(data.properties) && data.properties.length > 0) {
          setProperties(data.properties);
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
    let list = properties.slice();
    if (deal !== "all") list = list.filter((p) => p.deal === deal);
    if (type !== "all") list = list.filter((p) => p.type === type);
    if (query.trim()) {
      const q = query.trim();
      list = list.filter(
        (p) => p.title.includes(q) || p.location.includes(q) || p.district.includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "price-asc") return priceToNumber(a.price) - priceToNumber(b.price);
      if (sort === "price-desc") return priceToNumber(b.price) - priceToNumber(a.price);
      if (sort === "area-desc") return b.area - a.area;
      // newest بر اساس ترتیب آرایه (همان newest)
      return 0;
    });
    return list;
  }, [properties, deal, type, sort, query]);

  const stats = useMemo(() => {
    const saleCount = properties.filter((p) => p.deal === "sale").length;
    const rentCount = properties.filter((p) => p.deal === "rent").length;
    return { sale: saleCount, rent: rentCount, total: properties.length };
  }, [properties]);

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
      {/* هدر صفحه املاک */}
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
            <h1 className="text-base font-bold">املاک شهر قدس</h1>
            <p className="text-[11px] text-white/80">
              {stats.total} آگهی فعال در سراسر شهر
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
              placeholder="جستجوی محله، منطقه، نوع ملک…"
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {/* آمار سریع */}
        <section className="px-4 pt-3">
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="کل آگهی‌ها" value={stats.total.toLocaleString("fa-IR")} emoji="📋" tone="bg-card" />
            <StatCard label="فروش" value={stats.sale.toLocaleString("fa-IR")} emoji="💰" tone="bg-teal-50" />
            <StatCard label="رهن و اجاره" value={stats.rent.toLocaleString("fa-IR")} emoji="🔑" tone="bg-sky-50" />
          </div>
        </section>

        {/* فیلتر نوع معامله (تب‌ها) */}
        <section className="px-4 pt-3">
          <div className="flex items-center gap-1.5 bg-card border border-border/70 rounded-xl p-1 shadow-sm">
            {dealFilters.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDeal(d.id)}
                className={cn(
                  "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all",
                  deal === d.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <span className="ml-1">{d.emoji}</span>
                {d.label}
              </button>
            ))}
          </div>
        </section>

        {/* چیپ‌های نوع ملک — اسکرول افقی */}
        <section className="pt-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
            {propertyTypeFilters.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  type === t.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-card border border-border/70 text-foreground hover:bg-muted"
                )}
              >
                <span>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* نوار مرتب‌سازی */}
        <section className="px-4 pt-3 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {filtered.length.toLocaleString("fa-IR")} آگهی یافت شد
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground bg-card border border-border/70 rounded-lg px-2.5 py-1.5 hover:bg-muted transition-colors"
            >
              <ArrowUpDown className="size-3.5" />
              {sortOptions.find((s) => s.id === sort)?.label}
            </button>
            {sortOpen && (
              <div className="absolute left-0 mt-1 z-20 w-44 bg-card border border-border/70 rounded-xl shadow-lg overflow-hidden">
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
                      sort === s.id ? "font-bold text-primary bg-primary/5" : "text-foreground"
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
              <p className="text-sm">آگهی مطابق با فیلتر شما یافت نشد</p>
              <button
                type="button"
                onClick={() => {
                  setDeal("all");
                  setType("all");
                  setQuery("");
                }}
                className="mt-3 text-xs text-primary font-bold hover:underline"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            filtered.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                bookmarked={bookmarked.has(p.id)}
                onBookmark={() => toggleBookmark(p.id)}
              />
            ))
          )}
        </section>

        {/* دکمه ثبت آگهی شناور */}
        <section className="px-4 pt-4 pb-2">
          <button
            type="button"
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <span className="text-lg">＋</span>
            ثبت آگهی ملکی شما
          </button>
        </section>

        {/* فوتر */}
        <footer className="px-4 py-6 text-center">
          <div className="text-[11px] text-muted-foreground">
            املاک شبکه قدس © ۱۴۰۴
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
    <div className={cn("rounded-xl p-3 border border-border/60 shadow-sm", tone)}>
      <div className="text-xl">{emoji}</div>
      <div className="mt-1 text-base font-extrabold text-foreground tabular-nums">
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function PropertyCard({
  property,
  bookmarked,
  onBookmark,
}: {
  property: PropertyListing;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  return (
    <article className="rounded-2xl bg-card border border-border/70 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* تصویر شناختی */}
      <div className="relative h-32 bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
        <span className="text-5xl drop-shadow">{property.emoji}</span>

        {/* نشان نوع معامله */}
        <span
          className={cn(
            "absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md shadow",
            property.deal === "sale"
              ? "bg-teal-500 text-white"
              : "bg-sky-500 text-white"
          )}
        >
          {property.dealLabel}
        </span>

        {/* نشان نوع ملک */}
        <span
          className={cn(
            "absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-md",
            "bg-white/90 backdrop-blur shadow",
            property.badgeColor
          )}
        >
          {property.typeLabel}
        </span>

        {/* بوک‌مارک */}
        <button
          type="button"
          onClick={onBookmark}
          aria-label="ذخیره آگهی"
          className="absolute bottom-2 left-2 size-8 rounded-full bg-white/95 shadow flex items-center justify-center hover:bg-white transition-colors"
        >
          <Bookmark
            className={cn(
              "size-4 transition-colors",
              bookmarked ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
            )}
          />
        </button>

        {/* زمان انتشار */}
        <span className="absolute bottom-2 right-2 text-[10px] text-foreground/80 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md flex items-center gap-0.5">
          <Clock className="size-2.5" />
          {property.timeAgo}
        </span>
      </div>

      {/* بدنه کارت */}
      <div className="p-3">
        <h3 className="text-sm font-bold leading-snug line-clamp-2">
          {property.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="size-3" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* مشخصات فنی — ردیف آیکن‌ها */}
        <div className="mt-2.5 flex items-center gap-3 text-[11px] text-foreground/80">
          <span className="inline-flex items-center gap-1">
            <Maximize2 className="size-3.5 text-primary/70" />
            <span className="tabular-nums">{property.area.toLocaleString("fa-IR")} م²</span>
          </span>
          {property.rooms > 0 && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5 text-primary/70" />
              <span className="tabular-nums">{property.rooms.toLocaleString("fa-IR")}</span>
            </span>
          )}
          {property.totalFloors && (
            <span className="inline-flex items-center gap-1">
              <BuildingIcon className="size-3.5 text-primary/70" />
              <span className="tabular-nums">
                {property.floor?.toLocaleString("fa-IR") ?? "—"}/{property.totalFloors.toLocaleString("fa-IR")}
              </span>
            </span>
          )}
          {property.hasParking && <Car className="size-3.5 text-primary/70" />}
        </div>

        {/* امکانات */}
        <div className="mt-2 flex flex-wrap gap-1">
          {property.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="text-[10px] bg-muted/70 text-foreground/80 px-1.5 py-0.5 rounded"
            >
              {f}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="text-[10px] text-muted-foreground">
              +{property.features.length - 3}
            </span>
          )}
        </div>

        {/* قیمت / رهن */}
        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-end justify-between gap-2">
          <div>
            {property.deal === "sale" ? (
              <>
                <div className="text-[10px] text-muted-foreground">قیمت کل</div>
                <div className="text-sm font-extrabold text-primary tabular-nums">
                  {property.price}
                </div>
              </>
            ) : (
              <>
                <div className="text-[10px] text-muted-foreground">رهن</div>
                <div className="text-sm font-extrabold text-primary tabular-nums">
                  {property.price}
                </div>
                {property.rent && (
                  <div className="text-[11px] text-foreground/80 tabular-nums mt-0.5">
                    اجاره: {property.rent}
                  </div>
                )}
              </>
            )}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Phone className="size-3.5" />
            تماس
          </button>
        </div>
      </div>
    </article>
  );
}
